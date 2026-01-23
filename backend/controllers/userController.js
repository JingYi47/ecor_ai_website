import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail, sendWelcomeEmail } from "../emailVerify/verifyEmail.js";

//ĐĂNG KÝ
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNo,
      dateOfBirth,
      gender,
    } = req.body;

    // Kiểm tra thông tin bắt buộc
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin: họ, tên, email và mật khẩu",
      });
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email không hợp lệ",
      });
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
    }

    // Kiểm tra user đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email này đã được đăng ký",
      });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNo: phoneNo || "",
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      isVerified: false,
    });

    // Tạo verification token (CHO EMAIL VERIFY)
    const verificationToken = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Gửi email xác thực
    try {
      await verifyEmail(email, verificationToken, firstName);
      console.log(`✅ Email verify đã gửi đến ${email}`);
    } catch (emailError) {
      console.error(" Lỗi gửi email:", emailError);
    }

    // Tạo token JWT cho đăng nhập
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
        isVerified: false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Cập nhật token vào database
    newUser.token = token;
    await newUser.save();

    // Ẩn mật khẩu trong response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message:
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
      user: userResponse,
      token,
      requiresVerification: true,
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

// XÁC THỰC EMAIL
export const verifyEmailToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Thiếu token xác thực",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Kiểm tra đã verify chưa
    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Email đã được xác thực trước đó",
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          isVerified: user.isVerified,
        },
      });
    }

    // Cập nhật trạng thái verified
    user.isVerified = true;
    await user.save();

    // Gửi email chào mừng
    try {
      await sendWelcomeEmail(user.email, user.firstName);
    } catch (welcomeError) {
      console.error("Lỗi gửi email chào mừng:", welcomeError);
    }

    return res.status(200).json({
      success: true,
      message: "🎉 Xác thực email thành công!",
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error("Lỗi xác thực email:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Token đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

// GỬI LẠI EMAIL XÁC THỰC
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email không tồn tại",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email đã được xác thực",
      });
    }

    // Tạo token mới
    const verificationToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Gửi email
    await verifyEmail(user.email, verificationToken, user.firstName);

    return res.status(200).json({
      success: true,
      message: "📧 Email xác thực đã được gửi lại!",
    });
  } catch (error) {
    console.error("Lỗi gửi lại email:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

// ĐĂNG NHẬP
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email và mật khẩu",
      });
    }

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác",
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác",
      });
    }

    // Kiểm tra tài khoản đã xác thực chưa
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản chưa được xác thực. Vui lòng kiểm tra email.",
      });
    }

    // Tạo token mới
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        isVerified: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Cập nhật thông tin đăng nhập
    user.token = token;
    user.isLoggedIn = true;
    await user.save();

    // Ẩn mật khẩu trong response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

// ĐĂNG XUẤT
export const logout = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(200).json({
        success: true,
        message: "Đã đăng xuất",
      });
    }

    await User.findByIdAndUpdate(userId, {
      token: null,
      isLoggedIn: false,
    });

    return res.status(200).json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

//  LẤY THÔNG TIN CÁ NHÂN
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).select("-password -token");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy thông tin thành công",
      user,
    });
  } catch (error) {
    console.error("Lỗi lấy thông tin:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

//  CẬP NHẬT THÔNG TIN
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const {
      firstName,
      lastName,
      phoneNo,
      address,
      city,
      zipCode,
      dateOfBirth,
      gender,
    } = req.body;

    // Kiểm tra thông tin bắt buộc
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Họ và tên là bắt buộc",
      });
    }

    // Cập nhật thông tin
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        phoneNo,
        address,
        city,
        zipCode,
        dateOfBirth,
        gender,
      },
      { new: true, runValidators: true },
    ).select("-password -token");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

// ĐỔI MẬT KHẨU
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới",
      });
    }

    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
    }

    // Tìm user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu hiện tại không chính xác",
      });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

// THÊM VÀO YÊU THÍCH
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin sản phẩm",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } },
      { new: true },
    ).populate("wishlist", "name price images category");

    return res.status(200).json({
      success: true,
      message: "Đã thêm vào danh sách yêu thích",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Lỗi thêm yêu thích:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

// XÓA KHỎI YÊU THÍCH
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true },
    ).populate("wishlist", "name price images category");

    return res.status(200).json({
      success: true,
      message: "Đã xóa khỏi danh sách yêu thích",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Lỗi xóa yêu thích:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

// LẤY DANH SÁCH YÊU THÍCH
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId)
      .populate("wishlist", "name price images category brand discount")
      .select("wishlist");

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách yêu thích thành công",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Lỗi lấy yêu thích:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

// THÊM VÀO LỊCH SỬ XEM (GIỮ NGUYÊN)
export const addToViewHistory = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin sản phẩm",
      });
    }

    // Kiểm tra đã xem chưa
    const user = await User.findById(userId);
    const existingView = user.viewedProducts.find(
      (view) => view.productId.toString() === productId,
    );

    if (existingView) {
      existingView.viewCount += 1;
      existingView.viewedAt = new Date();
    } else {
      user.viewedProducts.push({
        productId,
        viewCount: 1,
      });
    }

    await user.save();
    await updateUserPreferences(userId);

    return res.status(200).json({
      success: true,
      message: "Đã cập nhật lịch sử xem",
    });
  } catch (error) {
    console.error("Lỗi thêm lịch sử xem:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

// CẬP NHẬT SỞ THÍCH (GIỮ NGUYÊN)
const updateUserPreferences = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate("viewedProducts.productId", "category brand price")
      .populate("wishlist", "category brand price");

    const allProducts = [
      ...user.viewedProducts.map((v) => v.productId),
      ...user.wishlist,
    ].filter(Boolean);

    const categories = [
      ...new Set(allProducts.map((p) => p?.category).filter(Boolean)),
    ];
    const brands = [
      ...new Set(allProducts.map((p) => p?.brand).filter(Boolean)),
    ];
    const prices = allProducts.map((p) => p?.price).filter(Boolean);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 100000000;

    user.preferences = {
      categories,
      brands,
      priceRange: { min: minPrice, max: maxPrice },
    };

    await user.save();
  } catch (error) {
    console.error("Lỗi cập nhật sở thích:", error);
  }
};

//  LẤY TẤT CẢ USER (ADMIN) (GIỮ NGUYÊN)
export const getAllUsers = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Truy cập bị từ chối. Chỉ dành cho quản trị viên.",
      });
    }

    const users = await User.find()
      .select("-password -token")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách người dùng thành công",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

// XÓA USER (ADMIN) (GIỮ NGUYÊN)
export const deleteUser = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Truy cập bị từ chối. Chỉ dành cho quản trị viên.",
      });
    }

    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Đã xóa người dùng thành công",
    });
  } catch (error) {
    console.error("Lỗi xóa user:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

//  QUÊN MẬT KHẨU (GIỮ NGUYÊN)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản với email này",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log(`OTP cho ${email}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: "Mã OTP đã được gửi đến email của bạn",
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("Lỗi quên mật khẩu:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};

// RESET MẬT KHẨU VỚI OTP (GIỮ NGUYÊN)
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Mã OTP không chính xác",
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Mã OTP đã hết hạn",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công",
    });
  } catch (error) {
    console.error("Lỗi reset mật khẩu:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    });
  }
};
