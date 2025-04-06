const Message = require("../models/Message");
const User = require("../models/User");

// Gửi tin nhắn
const sendMessage = async (req, res) => {
  const { message, receiverId } = req.body;
  const senderId = req.user._id; // ID của người gửi

  try {
    // Tạo room id từ sender và receiver IDs (sắp xếp để đảm bảo tính nhất quán)
    const participants = [senderId.toString(), receiverId].sort();
    const roomId = `chat_${participants.join('_')}`;

    const messageDoc = new Message({
      sender: senderId,
      receiver: receiverId,
      message,
      room: roomId,
    });

    await messageDoc.save();

    // Nếu có socket.io, emit sự kiện mới
    if (req.io) {
      req.io.to(roomId).emit('new_message', {
        ...messageDoc.toJSON(),
        senderInfo: await User.findById(senderId, 'username avatar role'),
      });
    }

    // Trả về tin nhắn đã lưu
    res.status(200).json(messageDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tin nhắn giữa User và Skincare_staff
const getMessages = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  try {
    // Tạo room id từ sender và receiver IDs (sắp xếp để đảm bảo tính nhất quán)
    const participants = [currentUserId.toString(), userId].sort();
    const roomId = `chat_${participants.join('_')}`;

    const messages = await Message.find({
      room: roomId
    })
    .sort({ createdAt: 1 }) // Sắp xếp theo thời gian tăng dần
    .populate('sender', 'username avatar role')
    .populate('receiver', 'username avatar role');

    // Đánh dấu các tin nhắn là đã đọc
    if (req.user.role === 'user' || req.user.role === 'skincare_staff') {
      await Message.updateMany(
        { room: roomId, receiver: currentUserId, read: false },
        { read: true }
      );
    }

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách cuộc trò chuyện của người dùng hiện tại
const getConversations = async (req, res) => {
  const currentUserId = req.user._id;
  const userRole = req.user.role;
  
  try {
    // Tìm tin nhắn cuối cùng của mỗi cuộc trò chuyện
    const lastMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(currentUserId) },
            { receiver: mongoose.Types.ObjectId(currentUserId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$room",
          lastMessage: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$lastMessage" }
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderInfo"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiverInfo"
        }
      },
      {
        $unwind: "$senderInfo"
      },
      {
        $unwind: "$receiverInfo"
      },
      {
        $project: {
          _id: 1,
          message: 1,
          createdAt: 1,
          room: 1,
          read: 1,
          sender: "$senderInfo._id",
          senderName: "$senderInfo.username",
          senderAvatar: "$senderInfo.avatar",
          senderRole: "$senderInfo.role",
          receiver: "$receiverInfo._id",
          receiverName: "$receiverInfo.username",
          receiverAvatar: "$receiverInfo.avatar",
          receiverRole: "$receiverInfo.role",
        }
      }
    ]);

    // Đếm số tin nhắn chưa đọc cho mỗi cuộc trò chuyện
    const conversations = await Promise.all(
      lastMessages.map(async (msg) => {
        // Xác định ID người còn lại trong cuộc trò chuyện
        const otherPersonId = msg.sender.toString() === currentUserId.toString() 
          ? msg.receiver 
          : msg.sender;
        
        // Đếm tin nhắn chưa đọc
        const unreadCount = await Message.countDocuments({
          room: msg.room,
          receiver: currentUserId,
          read: false
        });

        // User chỉ có thể chat với skincare_staff và ngược lại
        const otherPerson = msg.sender.toString() === currentUserId.toString() 
          ? {
              _id: msg.receiver,
              username: msg.receiverName,
              avatar: msg.receiverAvatar,
              role: msg.receiverRole
            }
          : {
              _id: msg.sender,
              username: msg.senderName,
              avatar: msg.senderAvatar,
              role: msg.senderRole
            };

        // Kiểm tra nếu cuộc trò chuyện phù hợp với vai trò
        if (
          (userRole === 'user' && otherPerson.role === 'skincare_staff') ||
          (userRole === 'skincare_staff' && otherPerson.role === 'user')
        ) {
          return {
            roomId: msg.room,
            lastMessage: msg.message,
            lastMessageTime: msg.createdAt,
            unreadCount,
            otherPerson
          };
        }
        return null;
      })
    );

    // Lọc các cuộc trò chuyện null và sắp xếp theo thời gian tin nhắn cuối cùng
    const filteredConversations = conversations
      .filter(conv => conv !== null)
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    res.status(200).json(filteredConversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đánh dấu tin nhắn đã đọc
const markAsRead = async (req, res) => {
  const { roomId } = req.params;
  const currentUserId = req.user._id;

  try {
    await Message.updateMany(
      { room: roomId, receiver: currentUserId, read: false },
      { read: true }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách người dùng có thể chat (skincare_staff lấy user, user lấy skincare_staff)
const getChatUsers = async (req, res) => {
  const currentUser = req.user;
  
  try {
    let users = [];
    if (currentUser.role === 'user') {
      // Người dùng chỉ có thể chat với nhân viên skincare
      users = await User.find(
        { role: 'skincare_staff', isOnline: true },
        'username avatar role isOnline'
      );
    } else if (currentUser.role === 'skincare_staff') {
      // Nhân viên skincare có thể chat với tất cả người dùng thông thường
      users = await User.find(
        { role: 'user' },
        'username avatar role isOnline'
      );
    }
    
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  sendMessage, 
  getMessages, 
  getConversations, 
  markAsRead,
  getChatUsers
};