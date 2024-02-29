"use client";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import Location from "@/Components/Location/Location";
import { useRouter, use } from "next/router";
import { RiCloseCircleLine } from "react-icons/ri";
import {
  loadUpdateData,
  loadUpdateUserData,
  userSignUpData,
} from "../../store/reducer/authSlice";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  linkWithCredential,
  EmailAuthProvider,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier
} from "firebase/auth";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { UpdateProfileApi } from "@/store/actions/campaign";
import dummyimg from "../../assets/Images/user_profile.png";
import { languageData } from "@/store/reducer/languageSlice";
import { translate } from "@/utils";
import LocationSearchBox from "@/Components/Location/LocationSearchBox";
import Image from "next/image";
import { Fcmtoken } from "@/store/reducer/settingsSlice";
import Layout from "../Layout/Layout";
import FirebaseData from "../../utils/Firebase";

const UserRegister = () => {
  const { authentication } = FirebaseData();

  const navigate = useRouter();
  const signupData = useSelector(userSignUpData);
  const FcmToken = useSelector(Fcmtoken);

  const [showCurrentLoc, setShowCurrentLoc] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(signupData.data?.data?.email ?? "");
  const [phone, setPhone] = useState(signupData.data?.data?.mobile ?? "");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [resendTimer, setResendTimer] = useState(60);
  const [otp, setOTP] = useState("");
  const [verificationID, setVerificationID] = useState("");
  const inputRefs = useRef([]);
  const otpInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [uploadedImage, setUploadedImage] = useState(null);

  const lang = useSelector(languageData);

  const navigateToHome = () => {
    navigate.push("/");
  };

  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        authentication,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
      console.log(window.recaptchaVerifier);
    }
  };

  useEffect(() => {
    // authentication.settings.appVerificationDisabledForTesting = true;
    generateRecaptcha();
    return () => {
      // Clear the recaptcha container
      const recaptchaContainer = document.getElementById("recaptcha-container");
      if (recaptchaContainer) {
        recaptchaContainer.innerHTML = "";
      }

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);
  useEffect(() => {
    if (signupData.data === null) {
      navigate.push("/");
    }
  }, [signupData]);
  useEffect(() => {
    let intervalId;

    if (resendTimer > 0) {
      intervalId = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [resendTimer]);
  useEffect(() => {
    if (!showOtpModal && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [showOtpModal]);

  useEffect(() => {}, [lang]);
  const handleOpenLocModal = () => {
    // onClose()
    setShowCurrentLoc(true);
  };
  const handleCloseLocModal = () => {
    setShowCurrentLoc(false);
  };
  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };
  const modalStyle = {
    display: showCurrentLoc ? "none" : "block",
  };
  const handleUploadButtonClick = () => {
    fileInputRef.current.click(); // Trigger the file input click event
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // const imageBlob = new Blob([e.target.result], { type: file.type });

        setImage(file);
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleResendOTP = () => {
  //   // Reset the resendTimer to 60 seconds
  //   setResendTimer(60);
  //   toast.success("OTP Resend Successfully");
  //   if (!username) {
  //     toast.error("Please enter your User Name");
  //     return;
  //   } else if (!phone) {
  //     toast.error("Please enter your Phone");
  //     return;
  //   } else if (!email) {
  //     toast.error("Please enter your Email");
  //     return;
  //   } else if (signupData.data?.data?.mobile && !password) {
  //     toast.error("Please set your Password");
  //     return;
  //   } else if (signupData.data?.data?.mobile && !confirmPassword) {
  //     toast.error("Please confirm your Password");
  //     return;
  //   // } else if (!selectedLocation) {
  //   //   toast.error("Please select your location");
  //   //   return;
  //   } else {
  //     const phoneRegex = /^\+[1-9]\d{1,14}$/; // Regular expression to match valid phone numbers with country code
  //     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Regular expression to match valid email addresses
  //     if (signupData.data?.data?.mobile && password !== confirmPassword) {
  //       toast.error("Password and Confirm Password should be same");
  //       return;
  //     } else if (!emailRegex.test(email)) {
  //       toast.error("Please enter a valid email address");
  //       return;
  //     } else if (!phoneRegex.test(phone)) {
  //       toast.error("Please enter a valid phone number");
  //       return;
  //     }
  //   }
  //   if (!signupData.data?.data?.mobile && signupData.data?.data?.email) {
  //     let appVerifier = window.recaptchaVerifier;
  //     const provider = new PhoneAuthProvider(authentication);
  //     provider.verifyPhoneNumber('+16464034732', appVerifier).then((verificationId) => {
  //       console.log(verificationId)
  //       const credential = PhoneAuthProvider.credential(verificationId, '077650');
  //       console.log(credential)
  //       // signInWithCredential(authentication, credential).then((result) => {
  //       //   // UpdateProfileApi({
  //       //   //   userid: signupData.data.data.id,
  //       //   //   name: username,
  //       //   //   email: signupData.data?.data?.email ?? "",
  //       //   //   mobile: phone.replace("+", ""),
  //       //   //   type: "3",
  //       //   //   address: address,
  //       //   //   firebase_id: signupData.data.data.firebase_id,
  //       //   //   logintype: "email",
  //       //   //   profile: image,
  //       //   //   fcm_id: FcmToken,
  //       //   //   notification: "1",
  //       //   //   city: 'selectedLocation.city',
  //       //   //   state: 'selectedLocation.state',
  //       //   //   country: 'selectedLocation.country',
  //       //   //   onSuccess: (res) => {
  //       //   //     toast.success("User Register Successfully.");
  //       //   //     loadUpdateUserData(res.data);
  //       //   //     navigate.push("/");
  //       //   //   },
  //       //   //   onError: (err) => {
  //       //   //     toast.error(err.message);
  //       //   //   },
  //       //   // });
  //       // }).catch((error) => {
  //       //   if (error.code === "auth/provider-already-linked") {
  //       //     toast.error("Email Provider already linked");
  //       //   } else if (error.code === "auth/user-token-expired") {
  //       //     toast.error("User token expired");
  //       //   } else if (error.code === "auth/email-already-in-use") {
  //       //       toast.error("Email already in use please try with another email");
  //       //   } else if (error.code === "auth/weak-password") {
  //       //     toast.error("Password should be at least 6 characters");
  //       //   } else if (error.code === "auth/operation-not-allowed") {
  //       //     toast.error("Operation not allowed");
  //       //   }
  //       //   const errorMessage = error.message;
  //       //   toast.error(errorMessage);
  //       // });
  //     }).catch((error) => {
  //       console.log(error);
  //       toast.error(error);
  //     });
  //   }
  // };

  const handleChange = (event, index) => {
    const value = event.target.value;
    if (!isNaN(value) && value !== "") {
      setOTP((prevOTP) => {
        const newOTP = [...prevOTP];
        newOTP[index] = value;
        return newOTP.join("");
      });

      // Move focus to the next input
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && index > 0) {
      setOTP((prevOTP) => {
        const newOTP = [...prevOTP];
        newOTP[index - 1] = "";
        return newOTP.join("");
      });

      // Move focus to the previous input
      inputRefs.current[index - 1].focus();
    } else if (event.key === "Backspace" && index === 0) {
      // Clear the first input if backspace is pressed on the first input
      setOTP((prevOTP) => {
        const newOTP = [...prevOTP];
        newOTP[0] = "";
        return newOTP.join("");
      });
    }
  };

  const handlOTPModalClose = () => {
    setShowOtpModal(false);
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    if (!username) {
      toast.error("Please enter your User Name");
      return;
    } else if (!phone) {
      toast.error("Please enter your Phone");
      return;
    } else if (!email) {
      toast.error("Please enter your Email");
      return;
    } else if (signupData.data?.data?.mobile && !password) {
      toast.error("Please set your Password");
      return;
    } else if (signupData.data?.data?.mobile && !confirmPassword) {
      toast.error("Please confirm your Password");
      return;
    } else if (!selectedLocation) {
      toast.error("Please select your location");
      return;
    } else {
      const phoneRegex = /^\+[1-9]\d{1,14}$/; // Regular expression to match valid phone numbers with country code
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Regular expression to match valid email addresses
      if (signupData.data?.data?.mobile && password !== confirmPassword) {
        toast.error("Password and Confirm Password should be same");
        return;
      } else if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      } else if (!signupData.data?.data?.mobile && !phoneRegex.test(phone)) {
        toast.error("Please enter a valid phone number");
        return;
      }
    }
    if (signupData.data?.data?.mobile && signupData.data?.data?.email) {
      console.log("hola", signupData.data.data.mobile);
      try {
        const result = await createUserWithEmailAndPassword(
          authentication,
          email,
          password
        );
        await updateEmail(authentication.currentUser, formData.email);

        console.log(result);
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          toast.error("Email already in use please try with another email");
        } else if (error.code === "auth/weak-password") {
          toast.error("Password should be at least 6 characters");
        } else {
          const errorMessage = error.message;
          toast.error(errorMessage);
          console.log(error.errorMessage);
        }
        return;
      }
    }
    if (signupData.data?.data?.mobile && !signupData.data?.data?.email) {
      var credential = EmailAuthProvider.credential(email, password);
      linkWithCredential(authentication.currentUser, credential).then((cred) => {
        UpdateProfileApi({
          userid: signupData.data.data.id,
          name: username,
          email: email,
          mobile: signupData.data?.data?.mobile ?? "",
          type: "3",
          address: address,
          firebase_id: signupData.data.data.firebase_id,
          logintype: "mobile",
          profile: image,
          fcm_id: FcmToken,
          notification: "1",
          city: selectedLocation.city,
          state: selectedLocation.state,
          country: selectedLocation.country,
          onSuccess: (res) => {
            toast.success("User Register Successfully.");
            loadUpdateUserData(res.data);
            navigate.push("/");
          },
          onError: (err) => {
            toast.error(err.message);
          },
        });
      }).catch((error) => {
        if (error.code === "auth/provider-already-linked") {
          toast.error("Email Provider already linked");
        } else if (error.code === "auth/user-token-expired") {
          toast.error("User token expired");
        } else if (error.code === "auth/email-already-in-use") {
            toast.error("Email already in use please try with another email");
        } else if (error.code === "auth/weak-password") {
          toast.error("Password should be at least 6 characters");
        } else if (error.code === "auth/operation-not-allowed") {
          toast.error("Operation not allowed");
        }
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
      // createUserWithEmailAndPassword(
      //   authentication,
      //   email,
      //   password
      // )
      //   .then((usercredential) => {
      //   })
      //   .catch((error) => {
      //     if (error.code === "auth/email-already-in-use") {
      //       toast.error("Email already in use please try with another email");
      //     } else if (error.code === "auth/weak-password") {
      //       toast.error("Password should be at least 6 characters");
      //     }
      //     const errorMessage = error.message;
      //     toast.error(errorMessage);
      //     console.log(error.errorMessage);
      //   });
    }
    if (!signupData.data?.data?.mobile && signupData.data?.data?.email) {
      UpdateProfileApi({
        userid: signupData.data.data.id,
        name: username,
        email: signupData.data?.data?.email ?? "",
        mobile: phone.replace("+", ""),
        type: "3",
        address: address,
        firebase_id: signupData.data.data.firebase_id,
        logintype: "email",
        profile: image,
        fcm_id: FcmToken,
        notification: "1",
        city: selectedLocation.city,
        state: selectedLocation.state,
        country: selectedLocation.country,
        onSuccess: (res) => {
          toast.success("User Register Successfully.");
          loadUpdateUserData(res.data);
          navigate.push("/");
        },
        onError: (err) => {
          toast.error(err.message);
        },
      });
      // let appVerifier = window.recaptchaVerifier;
      // let mobile = phone;
      // const provider = new PhoneAuthProvider(authentication);
      // provider.verifyPhoneNumber(mobile, appVerifier).then((verificationId) => {
      //   console.log(verificationId)
      //   setVerificationID(verificationId);
      //   setShowOtpModal(true);
      // }).catch((error) => {
      //   if (error.code === "auth/invalid-app-credential") {
      //     toast.error("Sorry. please try again.");
      //   } else if (error.code === "auth/too-many-requests") {
      //     toast.error("Too many requests. Please try again later.");
      //   }
      //   const errorMessage = error.message;
      //   toast.error(errorMessage);  
      // });
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    if (otp === "") {
      toast.error("Please enter OTP first.");
      return;
    }

    setShowLoader(true);

    const credential = PhoneAuthProvider.credential(verificationID, otp);
    console.log(credential)
    linkWithCredential(authentication.currentUser, credential).then((cred) => {
      UpdateProfileApi({
        userid: signupData.data.data.id,
        name: username,
        email: signupData.data?.data?.email ?? "",
        mobile: phone.replace("+", ""),
        type: "3",
        address: address,
        firebase_id: signupData.data.data.firebase_id,
        logintype: "email",
        profile: image,
        fcm_id: FcmToken,
        notification: "1",
        city: selectedLocation.city,
        state: selectedLocation.state,
        country: selectedLocation.country,
        onSuccess: (res) => {
          toast.success("User Register Successfully.");
          loadUpdateUserData(res.data);
          navigate.push("/");
        },
        onError: (err) => {
          toast.error(err.message);
        },
      });
    }).catch((error) => {
      if (error.code === "auth/provider-already-linked") {
        toast.error("Email Provider already linked");
      } else if (error.code === "auth/user-token-expired") {
        toast.error("User token expired");
      } else if (error.code === "auth/too-many-requests") {
          toast.error("Too many requests. Please try again later.");
      } else if (error.code === "auth/invalid-phone-number") {
        toast.error("Invalid phone number. Please enter a valid phone number.");
      } else if (error.code === "auth/invalid-verification-code") {
        toast.error("Invalid OTP number. Please enter a valid OTP number.");
      } else if (error.code === "auth/operation-not-allowed") {
        toast.error("Operation not allowed");
      }
      const errorMessage = error.message;
      toast.error(errorMessage);
    });
  };

  return (
    <>
      <Layout>
        <Breadcrumb title={translate("basicInfo")} />
        <section id="user_register">
          <div className="container">
            <div className="row" id="register_main_card">
              <div className="col-sm-12 col-md-6">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">{translate("addInfo")}</div>
                  </div>
                  <div className="card-body">
                    <form action="">
                      <div className="form_all_fields">
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="add_profile_div">
                              <div className="image_div">
                                <Image
                                  loading="lazy"
                                  src={uploadedImage || dummyimg.src}
                                  alt="no_img"
                                  width={200}
                                  height={200}
                                />
                              </div>
                              <div className="add_profile">
                                <input
                                  type="file"
                                  accept="image/jpeg, image/png"
                                  id="add_img"
                                  ref={fileInputRef}
                                  style={{ display: "none" }}
                                  onChange={handleImageUpload}
                                />
                                <button
                                  type="button"
                                  onClick={handleUploadButtonClick}
                                >
                                  {translate("uploadImg")}
                                </button>

                                <p>{translate("Note:")}</p>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-12 col-md-6">
                            <div className="user_fields">
                              <span>{translate("agencyName")}</span>
                              <input
                                type="text"
                                name="uname"
                                placeholder="Enter Your Name Please"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                              />
                            </div>
                          </div>
                          {/** */}
                          {signupData.data?.data?.email && (
                            <>
                              <div className="col-sm-12 col-md-6">
                                <div className="user_fields">
                                  <span>{translate("phoneNumber")}</span>
                                  <input
                                    type="text"
                                    name="mobile"
                                    placeholder="Enter Your Phone Number Please"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          {signupData.data?.data?.mobile && (
                            <>
                              <div className="col-sm-12 col-md-6">
                                <div className="user_fields">
                                  <span>{translate("email")}</span>
                                  <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter Your Email Please"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          {/** */}
                          {signupData.data?.data?.mobile && (
                            <>
                              <div className="col-sm-12 col-md-6">
                                <div className="user_fields">
                                  <span>{translate("password")}</span>
                                  <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter Your Password Please"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-12 col-md-6">
                                <div className="user_fields">
                                  <span>{translate("confirmationPassword")}</span>
                                  <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Enter Your Confirmation Password Please"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                      setConfirmPassword(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          {/** */}
                          <div className="col-sm-12 col-md-12">
                            <div className="user_fields">
                              <span>{translate("location")}</span>
                              {/* <div className='current_loc_div' onClick={handleOpenLocModal}>
                                                              <BiCurrentLocation size={30} className='current_loc' />
                                                              <span>{translate("selectYourCurrentLocation")}</span>
                                                          </div>
                                                          {selectedLocation && (
                                                              <input
                                                                  type='text'
                                                                  value={selectedLocation.formatted_address}
                                                                  readOnly
                                                              />
                                                          )} */}

                              <LocationSearchBox
                                onLocationSelected={handleSelectLocation}
                              />
                            </div>
                          </div>
                          <div className="col-sm-12 col-md-12">
                            <div className="user_fields">
                              <span>{translate("address")}</span>
                              <textarea
                                rows={4}
                                className="current_address"
                                placeholder="Enetr address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="card-footer">
                    <div className="basic_submit">
                      <button onClick={handleSubmitInfo}>
                        {translate("submit")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {showCurrentLoc && (
          <Location
            isOpen={true}
            onClose={handleCloseLocModal}
            onSelectLocation={handleSelectLocation}
          />
        )}
      </Layout>
      {showOtpModal && (
        <Modal
          show={showOtpModal}
          onHide={handlOTPModalClose}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="otp-modal"
          backdrop="static"
        >
          <Modal.Header>
            <Modal.Title>{translate("verification")}</Modal.Title>
            <RiCloseCircleLine
              className="close-icon"
              size={40}
              onClick={handlOTPModalClose}
            />
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="modal-body-heading">
                <h4>{translate("otpVerification")}</h4>
                <span>
                  {translate("enterOtp")} {phone}
                </span>
              </div>
              <div className="userInput">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    className="otp-field"
                    type="text"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(inputRef) => (inputRefs.current[index] = inputRef)}
                  />
                ))}
              </div>

              <div className="resend-code">
                {resendTimer > 0 ? (
                  <div>
                    <span className="resend-text">
                      {" "}
                      {translate("resendCodeIn")}
                    </span>
                    <span className="resend-time">
                      {" "}
                      {resendTimer} {translate("seconds")}
                    </span>
                  </div>
                ) : (
                  // <span id="re-text" onClick={handleResendOTP}>
                  <span id="re-text">
                    {translate("resendOtp")}
                  </span>
                )}
              </div>
              <div className="continue">
                <button
                  type="submit"
                  className="continue-button"
                  onClick={handleConfirm}
                >
                  {showLoader ? (
                    <div className="loader-container-otp">
                      <div className="loader-otp"></div>
                    </div>
                  ) : (
                    <span>{translate("confirm")}</span>
                  )}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
      <div id="recaptcha-container"></div>
    </>
  );
};

export default UserRegister;
