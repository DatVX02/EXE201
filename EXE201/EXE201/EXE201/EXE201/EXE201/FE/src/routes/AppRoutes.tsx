import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home/Homepage";
import BookingPage from "../pages/Home/Bookingpage";
import Login from "../layout/Login";
import Header from "../layout/Header";
import Register from "../layout/Register";
import { AuthProvider } from "../context/AuthContext";
//homepage
import ServicePage from "../pages/Home/Servicepage";
import SettingPage from "../pages/Home/Settingpage";
import ContactPage from "../pages/Home/ContactPage";
import BlogPage from "../pages/Home/Blogpage";
import TestPage from "../pages/Home/SkinAssessmentQuiz";
import BlogDetailPage from "../pages/Home/BlogDetailPage";
//manager
import ManageUser from "../pages/admin/ManageUser";
import ManageCategory from "../pages/admin/ManageCategory";
import ManageBlog from "../pages/admin/ManageBlog";
import ManagePayment from "../pages/admin/ManagePayment";
import ManageRating from "../pages/admin/ManageRating";
import AdminOverview from "../pages/admin/AdminOverview";
import AdminDashboard from "../components/Admin/AdminDashboard";
import ManageQuestion from "../pages/admin/ManageQuestion";

//staff
import CheckIn from "../pages/Staff/CheckIn";
import AssignSpecialists from "../pages/Staff/AssignSpecialists";
import AppointmentSchedules from "../pages/Staff/AppointmentSchedules";
import StaffManagement from "../components/Staff/StaffManagement";
import CheckOut from "../pages/Staff/CheckOut"; // Sử dụng component CheckOut

//therapist
// import ServiceHistory from "../pages/Therapist/ServiceHistory";
import TherapistManagement from "../components/Therapist/TherapistManagement";
import ListOfAssigned from "../pages/Therapist/ListOfAssigned";
import PerformService from "../pages/Therapist/PerformService";
import Forgot_password from "../layout/Forgot_password";
import ManageService from "../pages/admin/ManageService";

//customer
import ProfileUser from "../pages/Customer/Customer_profile";
import ManageVoucher from "../pages/admin/ManageVoucher";
import Booking from "../pages/Home/Booking";
import BookingService from "../pages/Home/BookingService";
import BookingDetail from "../pages/Home/BookingDetail";
import Cart from "../pages/Home/Cart";
import CheckOutService from "../pages/Home/CheckOutService";
import Customer_layout from "../pages/Customer/Customer_layout";
// import ChatBox from "../pages/Chatbox/ChatBoxT";
import DoctorChatList from "../pages/Therapist/DoctorChatList";
import DoctorChat from "../pages/Therapist/DoctorChat";
// import ChatBoxT from "../pages/Chatbox/ChatBoxT";
import ChatPage from "../pages/Chatbox/ChatPage";
const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/forgot-password"
            element={
              <>
                {/* <Header /> */}
                <Forgot_password />
              </>
            }
          />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/contact" element={<ContactPage />} />{" "}
          <Route path="/booking_services" element={<BookingService />} />
          <Route path="/booking_services/booking" element={<Booking />} />
          <Route path="/booking_services/services" element={<ServicePage />} />
          <Route path="/booking_services/:id" element={<BookingDetail />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:_id" element={<BlogDetailPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout-service" element={<CheckOutService />} />
          {/* <Route path="/blog-details/:id" element={<BlogPage />} /> */}
          <Route path="/test" element={<TestPage />} />
          {/* <Route path="/blog-details/:id" element={<BlogPage />} /> */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminOverview />} />
            <Route path="user-management" element={<ManageUser />} />
            <Route path="service-management" element={<ManageService />} />
            <Route path="voucher-management" element={<ManageVoucher />} />
            <Route path="category-management" element={<ManageCategory />} />
            <Route path="blog-management" element={<ManageBlog />} />
            <Route path="payment-management" element={<ManagePayment />} />
            <Route path="rating-management" element={<ManageRating />} />
            <Route path="question-management" element={<ManageQuestion />} />
            <Route path="settings" element={<SettingPage />} />
          </Route>
          {/* The therapist router */}
          <Route path="/doctor_staff" element={<TherapistManagement />}>
            <Route path="list-of-assigned" element={<ListOfAssigned />} />
            <Route path="perfom-service" element={<PerformService />} />
            <Route path="/doctor_staff/chat" element={<DoctorChatList />} />
            <Route path="/doctor_staff/chat/:cartId" element={<DoctorChat />} />
            <Route path="settings" element={<SettingPage />} />
          </Route>
          {/* Staff router */}
          <Route path="/staff" element={<StaffManagement />}>
            <Route path="check-in" element={<CheckIn />} />
            <Route path="assign-specialists" element={<AssignSpecialists />} />
            <Route path="check-out" element={<CheckOut />} />{" "}
            {/* Sử dụng CheckOut component */}
            <Route
              path="appointment-schedules"
              element={<AppointmentSchedules />}
            />
          </Route>
          {/* Customer router */}
          <Route path="/dashboard" element={<ProfileUser />} />
          <Route path="/order_history" element={<Customer_layout />} />
          {/* Login */}
          <Route
            path="/login"
            element={
              <>
                {/* <Header /> */}
                <Login />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                {/* <Header /> */}
                <Register />
              </>
            }
          />
          <Route path="/chat/:cartId" element={<ChatPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
