import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { RiCloseCircleLine } from "react-icons/ri";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import OTPModal from "../OTPModal/OTPModal";
import { toast } from "react-hot-toast";
import { translate } from "@/utils";
import { useSelector } from "react-redux";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import FirebaseData from "../../utils/Firebase";

import { signupLoaded } from "../../store/reducer/authSlice"; // Update the import path as needed
import { useRouter } from "next/router";
import {
  Fcmtoken,
  settingsData,
  settingsLoadedLogin,
} from "@/store/reducer/settingsSlice";
import Swal from "sweetalert2";
import axios from "axios";
const backend_api = process.env.NEXT_PUBLIC_API_URL;
const end_point = process.env.NEXT_PUBLIC_END_POINT;

const EmailLoginModal = ({ isOpen, onClose }) => {
  const LOGIN = "login";
  const REGISTER = "register";
  const [modalType, setModalType] = useState(LOGIN);
  const SettingsData = useSelector(settingsData);
  const isDemo = SettingsData?.demo_mode;
  const DemoNumber = "+919764318246";
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [value, setValue] = useState(isDemo ? DemoNumber : "");
  const { authentication } = FirebaseData();
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useRouter();
  const FcmToken = useSelector(Fcmtoken);

  const onLoginSuccess = (result) => {
    signupLoaded(
      "",
      result.user.email,
      result.user.phoneNumber ? result.user.phoneNumber?.replace("+", "") : "",
      "1",
      "",
      result.user.uid,
      "",
      "",
      FcmToken,
      (res) => {
        let signupData = res.data;

        // Show a success toast notification
        setShowLoader(false);
        console.log("res", res);
        // Check if any of the required fields is empty
        if (!res.error) {
          if (
            signupData.name === "" ||
            signupData.email === "" ||
            // signupData.address === "" ||
            signupData.logintype === ""
          ) {
            navigate.push("/user-register", {
              isLogin: modalType === LOGIN,
            });
            onClose(); // Close the modal
          } else {
            toast.success(res.message); // Show a success toast
            onClose(); // Close the modal
          }
          settingsLoadedLogin(
            null,
            signupData?.id,
            (res) => {},
            (error) => {
              console.log(error);
            }
          );
        }
      },
      (err) => {
        console.log(err);
        if (
          err === "Account Deactivated by Administrative please connect to them"
        ) {
          onClose(); // Close the modal
          Swal.fire({
            title: "Opps!",
            text: "Account Deactivated by Administrative please connect to them",
            icon: "warning",
            showCancelButton: false,
            customClass: {
              confirmButton: "Swal-confirm-buttons",
              cancelButton: "Swal-cancel-buttons",
            },
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate.push("/contact-us");
            }
          });
        }
      },
      () => {},
      result.user.orn_number,
      result.user.whatsapp_number
    );
    // onClose();
  };
  const onSignUp = (e) => {
    e.preventDefault();
    console.log(emailValue, passwordValue);

    if (!emailValue || !passwordValue || !confirmPasswordValue) {
      toast.error("Please enter your Email and Password");
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Regular expression to match valid email addresses
      if (passwordValue !== confirmPasswordValue) {
        toast.error("Password and Confirm Password should be same");
      } else if (emailRegex.test(emailValue)) {
        // Phone number is valid, proceed to OTP modal

        createUserWithEmailAndPassword(
          authentication,
          emailValue,
          passwordValue
        )
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            onLoginSuccess(userCredential);

            toast.success(translate("registersuccess"));
          })
          .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
              toast.error("Email already in use please try with another email");
            } else if (error.code === "auth/weak-password") {
              toast.error("Password should be at least 6 characters");
            }
            const errorMessage = error.message;
            toast.error(errorMessage);
            console.log(error.errorMessage);
          });
        // onClose();
      } else {
        toast.error("Please enter a valid Email!");
      }
    }
  };
  const onLogin = (e) => {
    e.preventDefault();
    console.log(emailValue, passwordValue);
    console.log('authentication:', authentication);
    if (!emailValue || !passwordValue) {
      toast.error("Please enter your Email and Password");
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Regular expression to match valid email addresses

      if (emailRegex.test(emailValue)) {
        // Phone number is valid, proceed to OTP modal

        signInWithEmailAndPassword(authentication, emailValue, passwordValue)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            onLoginSuccess(userCredential);

            toast.success(translate("loginsuccess"));
          })
          .catch((error) => {
            console.log('error:', error.message);
            if (error.message === 'Firebase: Error (auth/user-not-found).') {
              axios.post(`${backend_api}${end_point}get_user_phone`, {
                email: emailValue,
                password: passwordValue
              })
                  .then(res => {
                    if (res.data.mobile === undefined) {
                      toast.error("Invalid Email or Password");
                    } else {
                      signupLoaded(
                          "",
                          "",
                          res.data.mobile,
                          "1",
                          "",
                          res.data.firebase_id,
                          "",
                          "",
                          FcmToken,
                          (res) => {
                            let signupData = res.data;

                            // Show a success toast notification
                            setShowLoader(false);

                            // Check if any of the required fields is empty
                            if (!res.error) {
                              if (
                                  signupData.name === "" ||
                                  signupData.email === "" ||
                                  // signupData.address === "" ||
                                  signupData.logintype === ""
                              ) {
                                navigate.push("/user-register");
                                onClose(); // Close the modal
                              } else {
                                toast.success(res.message); // Show a success toast
                                onClose(); // Close the modal
                              }
                              settingsLoadedLogin(
                                  null,
                                  signupData?.id,
                                  (res) => {},
                                  (error) => {
                                    console.log(error);
                                  }
                              );
                            }
                          },
                          (err) => {
                            console.log(err);
                            if (
                                err ===
                                "Account Deactivated by Administrative please connect to them"
                            ) {
                              onClose(); // Close the modal
                              Swal.fire({
                                title: "Opps!",
                                text: "Account Deactivated by Administrative please connect to them",
                                icon: "warning",
                                showCancelButton: false,
                                customClass: {
                                  confirmButton: "Swal-confirm-buttons",
                                  cancelButton: "Swal-cancel-buttons",
                                },
                                confirmButtonText: "Ok",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  navigate.push("/contact-us");
                                }
                              });
                            }
                          },
                          () => {},
                          res.data.orn_number,
                          res.data.whatsapp_number
                      );
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  })
            }
            //auth/invalid-login-credentials
            else if (error.code === "auth/invalid-login-credentials") {
              toast.error("Invalid Email or Password");
            } else {
              const errorMessage = error.message;
              toast.error(errorMessage);
              console.log(error.errorMessage);
            }
          });
        // onClose();
      } else {
        toast.error("Please enter a valid Email!");
      }
    }
  };
  const onEmailChange = (e) => {
    setEmailValue(e.target.value);
  };
  const onPasswordChange = (e) => {
    setPasswordValue(e.target.value);
  };
  const onConfirmPasswordChange = (e) => {
    setConfirmPasswordValue(e.target.value);
  };

  return (
    <>
      <Modal
        show={isOpen}
        onHide={onClose}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="login-modal"
      >
        <Modal.Header>
          <Modal.Title>
            {modalType === LOGIN ? translate("login") : translate("register")}
          </Modal.Title>
          <RiCloseCircleLine
            className="close-icon"
            size={40}
            onClick={onClose}
          />
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="modal-body-heading">
              <h4>{translate("enterEmail")}</h4>
              <span>
                {modalType === LOGIN
                  ? translate("loginSubtitle")
                  : translate("registerSubtitle")}
              </span>
            </div>
            <div className="mobile-number">
              <label htmlFor="mail">{translate("email")}</label>
              <input
                type="email"
                id="mail"
                name="mail"
                onChange={onEmailChange}
                placeholder={translate("email")}
                className="custom-phone-input"
              />
            </div>
            <div className="mobile-number">
              <label htmlFor="password">{translate("password")}</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={onPasswordChange}
                placeholder={translate("password")}
                className="custom-phone-input"
              />
            </div>
            {modalType === REGISTER && (
              <div className="mobile-number">
                <label htmlFor="password">
                  {translate("confirmationPassword")}
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  onChange={onConfirmPasswordChange}
                  placeholder={translate("confirmPassword")}
                  className="custom-phone-input"
                />
              </div>
            )}
            <div className="continue">
              <button
                type="submit"
                className="continue-button"
                onClick={modalType === LOGIN ? onLogin : onSignUp}
              >
                {showLoader ? (
                  <div className="loader-container-otp">
                    <div className="loader-otp"></div>
                  </div>
                ) : (
                  <span>
                    {" "}
                    {modalType === LOGIN
                      ? translate("login")
                      : translate("register")}
                  </span>
                )}
              </button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <span>
            <div>
              {" "}
              {modalType === LOGIN ? (
                <span>
                  {translate("dontHaveAccount")}{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalType(REGISTER);
                    }}
                  >
                    {translate("register")}
                  </a>
                </span>
              ) : (
                <span>
                  {translate("alreadyHaveAccount")}{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalType(LOGIN);
                    }}
                  >
                    {translate("login")}
                  </a>
                </span>
              )}
            </div>
            {translate("byclick")}{" "}
            <a href="/terms-and-condition">{translate("terms&condition")}</a>{" "}
            <span className="mx-1"> {translate("and")} </span>{" "}
            <a href="/privacy-policy"> {translate("privacyPolicy")} </a>
          </span>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmailLoginModal;
