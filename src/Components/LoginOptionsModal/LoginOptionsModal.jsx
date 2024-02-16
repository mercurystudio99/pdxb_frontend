import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { RiCloseCircleLine } from "react-icons/ri";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import OTPModal from "../OTPModal/OTPModal";
import { toast } from "react-hot-toast";
import { translate } from "@/utils";
import { useSelector } from "react-redux";
import { settingsData } from "@/store/reducer/settingsSlice";
import { IoIosCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import LoginModal from "../LoginModal/LoginModal";
import EmailLoginModal from "../EmailLoginModal/EmailLoginModal";
const LoginOptionsModal = ({ isOpen, onClose }) => {
  const SettingsData = useSelector(settingsData);
  const isDemo = SettingsData?.demo_mode;
  const DemoNumber = "+919764318246";
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phonenum, setPhonenum] = useState();
  const [value, setValue] = useState(isDemo ? DemoNumber : "");
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const onSignUp = (e) => {
    e.preventDefault();
    if (!value) {
      toast.error("Please enter a phone number!");
    } else {
      const phoneRegex = /^\+[1-9]\d{1,14}$/; // Regular expression to match valid phone numbers with country code

      if (phoneRegex.test(value)) {
        // Phone number is valid, proceed to OTP modal
        setPhonenum(value);
        onClose();
        setShowOtpModal(true);
        if (isDemo) {
          setValue(DemoNumber);
        } else {
          setValue("");
        }
      } else {
        toast.error("Please enter a valid phone number");
      }
    }
  };

  const handlOTPModalClose = () => {
    setShowOtpModal(false);
    window.recaptchaVerifier = null;
  };

  const handleCloseModal = () => {
    setShowMobileModal(false);
  };
  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
  };
  const showMobileModalHandler = () => {
    onClose();
    setShowMobileModal(true);
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
          <Modal.Title>{translate("login&Regiser")}</Modal.Title>
          <RiCloseCircleLine
            className="close-icon"
            size={40}
            onClick={onClose}
          />
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="modal-body-heading">
              <h4>{translate("chooseloginmethod")}</h4>
              <span>{translate("email/mobileoptions")}</span>
            </div>
            <div
              style={{
                marginTop: "3rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                id="mail-o"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  width: "85%",
                }}
                onClick={showMobileModalHandler}
              >
                <IoIosCall size={20} />
                <div className="deatilss mx-2">
                  <span className="o-d" style={{ color: "#006169" }}>
                    {translate("UsingMobileNumber")}
                  </span>
                </div>
              </div>
              <div
                id="mail-o"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  width: "85%",
                  alignItems: "center",
                }}
                onClick={() => {
                  setShowEmailModal(true);
                  onClose();
                }}
              >
                <MdEmail size={20} />{" "}
                <div className="deatilss mx-2">
                  <span className="o-d" style={{ color: "#006169" }}>
                    {translate("UsingEmail")}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <span>
            {translate("byclick")}{" "}
            <a href="/terms-and-condition">{translate("terms&condition")}</a>{" "}
            <span className="mx-1"> {translate("and")} </span>{" "}
            <a href="/privacy-policy"> {translate("privacyPolicy")} </a>
          </span>
        </Modal.Footer>
      </Modal>

      {showMobileModal && (
        <LoginModal isOpen={showMobileModal} onClose={handleCloseModal} />
      )}
      {showEmailModal && (
        <EmailLoginModal
          isOpen={showEmailModal}
          onClose={handleCloseEmailModal}
        />
      )}
    </>
  );
};

export default LoginOptionsModal;
