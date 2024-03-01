"use client"
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DeleteAgentProfile, GetAgentList } from "@/store/actions/campaign";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Menu, Dropdown, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactPagination from "../Pagination/ReactPagination.jsx";
import Loader from "../Loader/Loader.jsx";
import toast from "react-hot-toast";
import { translate } from "@/utils/index.js";
import { languageData } from "@/store/reducer/languageSlice.js";
import Image from "next/image";
import dynamic from "next/dynamic.js";

const VerticleLayout = dynamic(() => import('../AdminLayout/VerticleLayout.jsx'), { ssr: false })
const UserAgents = () => {


    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [agentList, setAgentList] = useState([]);
    const [total, setTotal] = useState(0);
    const [imagePath, setImagePath] = useState('');
    const [offsetdata, setOffsetdata] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [agentIdToDelete, setAgentIdToDelete] = useState(null);
    const limit = 8;
    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;

    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);

    const handleClickAdd = () => {
        router.push(`/user/add-agent`);
    };
    const handleClickEdit = (agentId) => {
        router.push(`/user/edit-agent/${agentId}`);
    };
    const handleClickDelete = (agentId) => {
        setAgentIdToDelete(agentId);
        setIsLoading(true);
        DeleteAgentProfile(
            agentId,
            (response) => {
                setIsLoading(true);
                if (response.error) {
                    toast.error(response.message);
                } else {
                    toast.success(response.message);
                    GetAgentList({
                        offset: offsetdata.toString(),
                        limit: limit.toString(),
                        agency_id: isLoggedIn ? userCurrentId : "",
                        onSuccess: (response) => {
                            console.log(response);
                            setTotal(response.total);
                            setImagePath(response.imagepath);
                            setIsLoading(false);
                            setAgentList(response.data);
                        },
                        onError: (error) => {
                            setIsLoading(false);
                            console.log(error);
                        }
                    });
                }
            },
            (error) => {
                setIsLoading(false);
                toast.error(error);
            }
        );
    };

    useEffect(() => {
        setIsLoading(true);
        GetAgentList({
            offset: offsetdata.toString(),
            limit: limit.toString(),
            agency_id: isLoggedIn ? userCurrentId : "",
            onSuccess: (response) => {
                console.log(response);
                setTotal(response.total);
                setImagePath(response.imagepath);
                setIsLoading(false);
                setAgentList(response.data);
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        });
    }, [offsetdata, isLoggedIn, agentIdToDelete]);

    const handlePageChange = (selectedPage) => {
        const newOffset = selectedPage.selected * limit;
        setOffsetdata(newOffset);
        window.scrollTo(0, 0);
    };
    return (
        <VerticleLayout>
            <div className="container">
                <div className="row" id="dashboard_top_card">
                    <div className="col-12">
                        <div className="d-flex flex-row-reverse">
                            <button class="btn" id="dashboard_add" onClick={handleClickAdd}>
                                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mx-2 add-nav-button" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                {translate("addAgent")}
                            </button>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="table_content card bg-white">
                            <TableContainer
                                component={Paper}
                                sx={{
                                    background: "#fff",
                                    padding: "10px",
                                }}
                            >
                                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                                    <TableHead
                                        sx={{
                                            background: "#f5f5f5",
                                        }}
                                    >
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("profile")}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("Name")}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("phoneNumber")}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("Whatsapp")}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("email")}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("action")}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    {/* Centered loader */}
                                                    <div>
                                                        <Loader />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : agentList && agentList.length > 0 ? (
                                            agentList.map((elem, index) => (
                                                <TableRow key={index}>
                                                    <TableCell component="th" scope="row">
                                                        <div className="card" id="listing_card">
                                                            <div className="listing_card_img">
                                                                <Image loading="lazy" src={imagePath + elem.profile_image} alt="no_img" width={80} height={80} style={{ borderRadius: 80 }} />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center">{elem.name}</TableCell>
                                                    <TableCell align="center">{elem.phone}</TableCell>
                                                    <TableCell align="center">{elem.whatsapp}</TableCell>
                                                    <TableCell align="center">{elem.email}</TableCell>
                                                    <TableCell align="center">
                                                        <Dropdown
                                                            visible={anchorEl === index}
                                                            onVisibleChange={(visible) => {
                                                                if (visible) {
                                                                    setAnchorEl(index);
                                                                } else {
                                                                    setAnchorEl(null);
                                                                }
                                                            }}
                                                            overlay={
                                                                <Menu>
                                                                    <Menu.Item key="edit" onClick={() => handleClickEdit(elem.id)}>
                                                                        <Button type="text" icon={<EditOutlined />}>
                                                                            {translate("edit")}
                                                                        </Button>
                                                                    </Menu.Item>
                                                                    <Menu.Item key="delete">
                                                                        <Button type="text" icon={<DeleteOutlined />} onClick={() => handleClickDelete(elem.id)}>
                                                                            {translate("delete")}
                                                                        </Button>
                                                                    </Menu.Item>
                                                                </Menu>
                                                            }
                                                        >
                                                            <Button id="simple-menu">
                                                                <BsThreeDotsVertical />
                                                            </Button>
                                                        </Dropdown>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    <p>{translate("noDataAvailabe")}</p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {agentList && agentList.length > 0 ? (
                                <div className="col-12">
                                    <ReactPagination pageCount={Math.ceil(total / limit)} onPageChange={handlePageChange} />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </VerticleLayout>

    )
}

export default UserAgents
