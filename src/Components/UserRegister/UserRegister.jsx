"use client";
import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import Location from "@/Components/Location/Location";
import { useRouter, use } from "next/router";
import {
  loadUpdateData,
  loadUpdateUserData,
  userSignUpData,
} from "../../store/reducer/authSlice";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
  const navigateToHome = () => {
    navigate.push("/");
  };

  useEffect(() => {
    if (signupData.data === null) {
      navigate.push("/");
    }
  }, [signupData]);
  const [showCurrentLoc, setShowCurrentLoc] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(signupData.data?.data?.email ?? "");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileInputRef = useRef(null);

  const [uploadedImage, setUploadedImage] = useState(null);

  const lang = useSelector(languageData);

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
  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    if (!username) {
      toast.error("Please enter your User Name");
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
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Regular expression to match valid email addresses
      if (signupData.data?.data?.mobile && password !== confirmPassword) {
        toast.error("Password and Confirm Password should be same");
        return;
      } else if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
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
  };

  return (
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
                            <span>{translate("userName")}</span>
                            <input
                              type="text"
                              name="uname"
                              placeholder="Enter Your Name Please"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                        </div>
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
  );
};

export default UserRegister;
