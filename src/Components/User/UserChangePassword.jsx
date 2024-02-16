"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic.js";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { Fcmtoken, settingsData } from "@/store/reducer/settingsSlice";
import LocationSearchBox from "@/Components/Location/LocationSearchBox";
import { UpdateProfileApi } from "@/store/actions/campaign";
import { loadUpdateUserData } from "@/store/reducer/authSlice";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { translate } from "@/utils";
import { languageData } from "@/store/reducer/languageSlice";
import Image from "next/image";
import FirebaseData from "../../utils/Firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
const VerticleLayout = dynamic(
  () => import("../AdminLayout/VerticleLayout.jsx"),
  { ssr: false }
);

const UserChangePassword = () => {
  const userData = useSelector((state) => state.User_signup);
  const userProfileData = userData?.data?.data;
  const navigate = useRouter();
  const FcmToken = useSelector(Fcmtoken);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    fullName: userProfileData?.name,
    email: userProfileData?.email,
    phoneNumber: userProfileData?.mobile,
    address: userProfileData?.address,
    aboutMe: userProfileData?.about_me,
    facebook: userProfileData?.facebook_id,
    instagram: userProfileData?.instagram_id,
    pintrest: userProfileData?.pintrest_id,
    twiiter: userProfileData?.twiiter_id,
    profileImage: userProfileData?.profile,
    whatsappNumber: userProfileData?.whatsapp_number,
    brokerOrnNumber: userProfileData?.orn_number,
  });
  const fileInputRef = useRef(null);
  const { authentication } = FirebaseData();

  const [uploadedImage, setUploadedImage] = useState(
    userProfileData?.profile || null
  );

  const lang = useSelector(languageData);

  useEffect(() => {}, [lang]);
  const DummyImgData = useSelector(settingsData);
  const PlaceHolderImg = DummyImgData?.web_placeholder_logo;
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          profileImage: file,
        });
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click(); // Trigger the file input click event
  };

  const handleLocationSelected = (locationData) => {
    setFormData({
      ...formData,
      selectedLocation: locationData,
    });
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, phoneNumber: value });
    }
  };

  const isLoggedIn = useSelector((state) => state.User_signup);
  const userCurrentId =
    isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
  const handleUpdateProfile = (e) => {
    e.preventDefault();

    if (password === "") {
      toast.error("Please Enter Password");
      return;
    }
    if (confirmPassword === "") {
      toast.error("Please Enter Confirm Password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const emailCred = EmailAuthProvider.credential(
      authentication.currentUser,
      oldPassword
    );
    signInWithEmailAndPassword(
      authentication,
      userProfileData.email,
      oldPassword
    )
      .then(() => {
        updatePassword(authentication.currentUser, password)
          .then(() => {
            toast.success("Password Updated Successfully");
            navigate.push("/");
          })
          .catch((error) => {
            console.log(error);
            toast.error(error.message);
          });
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          toast.error("The old password is wrong.");
        }
        toast.error(error.message);
      });

    // UpdateProfileApi({
    //   userid: userCurrentId,
    //   name: formData.fullName,
    //   email: formData.email,
    //   mobile: formData.phoneNumber,
    //   address: formData.address,
    //   profile: formData.profileImage,
    //   latitude: formData.selectedLocation?.lat,
    //   longitude: formData.selectedLocation?.lng,
    //   about_me: formData.aboutMe ? formData.aboutMe : "",
    //   facebook_id: formData.facebook ? formData.facebook : "",
    //   twiiter_id: formData.twiiter ? formData.twiiter : "",
    //   instagram_id: formData.instagram ? formData.instagram : "",
    //   pintrest_id: formData.pintrest ? formData.pintrest : "",
    //   fcm_id: FcmToken,
    //   notification: "1",
    //   city: formData.selectedLocation?.city,
    //   state: formData.selectedLocation?.state,
    //   country: formData.selectedLocation?.country,
    //   ornNumber: formData.brokerOrnNumber,
    //   whatsappNumber: formData.whatsappNumber,
    //   onSuccess: (response) => {
    //     toast.success("Profile Updated Successfully");
    //     loadUpdateUserData(response.data);
    //     navigate.push("/");
    //     setFormData({
    //       fullName: "",
    //       email: "",
    //       phoneNumber: "",
    //       address: "",
    //       aboutMe: "",
    //       facebook: "",
    //       instagram: "",
    //       pintrest: "",
    //       twiiter: "",
    //     });
    //   },
    //   onError: (error) => {
    //     toast.error(error.message);
    //   },
    // });
  };

  return (
    <VerticleLayout>
      <div className="container">
        <div className="dashboard_titles">
          <h3>{translate("myProfile")}</h3>
        </div>
        <div className="profile_card">
          <form>
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <div className="card" id="personal_info_card">
                  <div className="card-header">
                    <h4>{translate("personalInfo")}</h4>
                  </div>
                  <div
                    style={{
                      minHeight: "fit-content",
                      backgroundColor: "transparent",
                      padding: "20px",
                    }}
                  >
                    <div className="row">
                      {/** */}
                      <div className="col-sm-12 col-md-6">
                        <div className="add_user_fields_div">
                          <span>{translate("oldpassword")}</span>
                          <input
                            type="password"
                            name="oldpassword"
                            placeholder="Enter Your old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6">
                        <div className="add_user_fields_div">
                          <span>{translate("password")}</span>
                          <input
                            type="password"
                            name="password"
                            placeholder="Enter Your New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6">
                        <div className="add_user_fields_div">
                          <span>{translate("confirmationPassword")}</span>
                          <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Enter Your Confirmation Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-5">
                      <div className="col-12">
                        <div className="submit_div">
                          <button type="submit" onClick={handleUpdateProfile}>
                            {translate("changePassword")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </VerticleLayout>
  );
};

export default UserChangePassword;
