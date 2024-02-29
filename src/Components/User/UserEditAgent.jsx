"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic.js";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { settingsData } from "@/store/reducer/settingsSlice";
import { GetAgentList, UpdatePostAgentProfile } from "@/store/actions/campaign";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { translate } from "@/utils";
import { languageData } from "@/store/reducer/languageSlice";
import Image from "next/image";
const VerticleLayout = dynamic(
  () => import("../../../src/Components/AdminLayout/VerticleLayout.jsx"),
  { ssr: false }
);

const UserEditAgent = () => {
  const router = useRouter();
  const agentId = router.query.slug;
  const userData = useSelector((state) => state.User_signup);
  const userProfileData = userData?.data?.data;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    review: "",
    profileImage: "",
    whatsappNumber: "",
  });
  const fileInputRef = useRef(null);

  const [uploadedImage, setUploadedImage] = useState(null);

  const lang = useSelector(languageData);

  useEffect(() => {
    GetAgentList({
      offset: '0',
      limit: '1',
      id: agentId,
      onSuccess: (response) => {
        const data = response && response.data;
        setFormData({
          fullName: data[0].name,
          email: data[0].email,
          phoneNumber: data[0].phone,
          review: data[0].review,
          profileImage: data[0].profile_image,
          whatsappNumber: data[0].whatsapp
        });
      },
      onError: (error) => {
          console.log(error);
      }
    });
  }, [agentId]);

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

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, phoneNumber: value });
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    try {
      UpdatePostAgentProfile(
        0,
        agentId,
        formData.fullName,
        formData.email,
        formData.phoneNumber,
        formData.whatsappNumber,
        formData.profileImage,
        formData.review,
        userProfileData?.id,
        async (response) => {
          if (response.data === "success") {
            toast.success(response.message);
            router.push("/user/agents");
          } else {
            toast.error(response.message);
          }
        },
        (error) => {
          toast.error(error);
        }
      );
    } catch (error) {
      console.log("An error occurred:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <VerticleLayout>
      <div className="container">
        <div className="dashboard_titles">
          <h3>{translate("agentProfile")}</h3>
        </div>
        <div className="profile_card">
          <form>
            <div className="row">
              <div className="col-12">
                <div className="card" id="personal_info_card">
                  <div className="card-header">
                    <h4>{translate("agentInfo")}</h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="add_profile_div">
                          <div className="image_div">
                            <Image
                              loading="lazy"
                              src={uploadedImage || PlaceHolderImg}
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

                            <span className="mx-2">{translate("agentLogo")}</span>

                            <p>{translate("Note:")}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6">
                        <div className="add_user_fields_div">
                          <span>{translate("agentName")}</span>
                          <input
                            type="text"
                            className="add_user_fields"
                            name="fullName"
                            placeholder="Enter Your Agent Name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6">
                        <div className="add_user_fields_div">
                          <span>{translate("email")}</span>
                          <input
                            type="text"
                            className="add_user_fields"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6">
                        <div className="add_user_fields_div">
                          <span>{translate("whatsapp")}</span>
                          <input
                            type="text"
                            className="add_user_fields"
                            name="whatsappNumber"
                            placeholder="9715xxxxxxxx"
                            value={formData.whatsappNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="col-sm-12 col-md-6">
                        <div className="add_user_fields_div">
                          <span>{translate("phoneNumber")}</span>
                          <input
                            readOnly
                            type="text"
                            className="add_user_fields"
                            name="phoneNumber"
                            placeholder="971xxxxxxxxx"
                            value={formData.phoneNumber}
                            onChange={handlePhoneNumberChange}
                          />
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="add_user_fields_div">
                          <span>{translate("review")}</span>
                          <textarea
                            rows={4}
                            className="add_user_fields"
                            name="review"
                            placeholder="Write a review"
                            value={formData.review}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="submit_div">
                    <button type="submit" onClick={handleUpdateProfile}>
                        {translate("save")}
                    </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </VerticleLayout>
  );
};

export default UserEditAgent;
