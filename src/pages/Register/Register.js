import "./Register.css";
import TabTitle from "../TapTitle";
import SuperShipLogo from "../../assets/images/SuperShip-Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, Select } from "antd";
import React from "react";
import { message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
const { Option } = Select;

const Register = () => {
  TabTitle("Register");

  const success = () => {
    message.success({
      content: "Bạn đã đăng kí thành công",
      className: "custom-class",
      style: {
        marginTop: "40vh",
      },
    });
  };

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    var valuesFinish = { ...address, ...values };
    console.log(valuesFinish);
    success();
    setTimeout(() => navigate("/"), 3000);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="84">+84</Option>
      </Select>
    </Form.Item>
  );

  // addreses

  const [provinces, setprovinces] = useState([]);
  const [districts, setdistricts] = useState([]);
  const [districtid, setdistrictid] = useState("");
  const [district, setdistrict] = useState("");
  const [communes, setcommunes] = useState([]);
  const [communid, setcommunid] = useState("");
  const [commune, setcommune] = useState("");
  const [address, setaddress] = useState([]);

  console.log(provinces);
  console.log(districts);
  console.log(communes);

  // provinces
  useEffect(() => {
    var provinceApi = {
      method: "get",
      url: "https://api.mysupership.vn/v1/partner/areas/province",
      headers: {},
    };

    axios(provinceApi)
      .then(function (response) {
        setprovinces(response.data.results);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const onChangeprovince = (value) => {
    console.log(`selected ${value}`);
    setdistrictid(value);
    setdistrict("");
    setcommune("");
  };

  const onSearchprovince = (value) => {
    console.log("search:", value);
  };

  useEffect(() => {
    var districtApi = {
      method: "get",
      url: `https://api.mysupership.vn/v1/partner/areas/district?province=${districtid}`,
      headers: {},
    };
    axios(districtApi)
      .then(function (response) {
        setdistricts(response.data.results);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [districtid]);

  //district

  const onChangedistrict = (value) => {
    var districtO = districts.filter((district) => {
      return district.code === value;
    });
    setdistrict(districtO[0].name);
    setcommunid(value);
    setcommune("");
  };

  const onSearchdistrict = (value) => {
    console.log("search:", value);
  };

  useEffect(() => {
    var districtApi = {
      method: "get",
      url: `https://api.mysupership.vn/v1/partner/areas/commune?district=${communid}`,
      headers: {},
    };
    axios(districtApi)
      .then(function (response) {
        setcommunes(response.data.results);
        console.log(response.data.results);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [communid]);
  //commun

  const onChangecommune = (value) => {
    var communsO = communes.filter((commune) => {
      return commune.code === value;
    });
    console.log(communsO[0]);
    setcommune(communsO[0].name);

    var addresscode = communsO[0];
    delete addresscode.code;
    setaddress(addresscode);
  };

  const onSearchcommune = (value) => {
    console.log(value);
  };

  // adresses

  return (
    <>
      <div className="Register-align-box">
        <div className="box">
          <div className="img">
            <img
              src={SuperShipLogo}
              alt="img not load"
              style={{ width: "80px", height: "80px" }}
            />
          </div>
          <h2 className="title">Register</h2>
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
              prefix: "84",
            }}
            scrollToFirstError
          >
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="company"
              label="Company"
              rules={[
                {
                  required: true,
                  message: "Please input your company!",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* addresses */}
            <Form.Item
              label="Province"
              Name="province"
              rules={[{ required: true }]}
              style={{ width: "100%" }}
            >
              <Select
                showSearch
                placeholder="Select a province"
                // optionFilterProp="children"
                onChange={onChangeprovince}
                onSearch={onSearchprovince}
                filterOption={(input, option) =>
                  option.children.includes(input)
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {provinces === undefined
                  ? ""
                  : provinces.map((province, key) => {
                      return (
                        <Option key={key} value={province.code}>
                          {province.name}
                        </Option>
                      );
                    })}
              </Select>
            </Form.Item>

            <Form.Item
              label="District"
              Name="district"
              rules={[{ required: true }]}
            >
              <Select
                value={district}
                style={{ width: "100%" }}
                showSearch
                placeholder="Select a distrist"
                // optionFilterProp="children"
                onChange={onChangedistrict}
                onSearch={onSearchdistrict}
                filterOption={(input, option) =>
                  option.children.includes(input)
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {districts === undefined
                  ? ""
                  : districts.map((district, key) => {
                      return (
                        <Option key={key} value={district.code}>
                          {district.name}
                        </Option>
                      );
                    })}
              </Select>
            </Form.Item>
            <Form.Item
              rules={[{ required: true }]}
              label="Commune"
              Name="commune"
            >
              <Select
                style={{ width: "100%" }}
                value={commune}
                showSearch
                placeholder="Select a distrist"
                // optionFilterProp="children"
                onChange={onChangecommune}
                onSearch={onSearchcommune}
                filterOption={(input, option) =>
                  option.children.includes(input)
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {communes === undefined
                  ? ""
                  : communes.map((commune, key) => {
                      return (
                        <Option key={key} value={commune.code}>
                          {commune.name}
                        </Option>
                      );
                    })}
              </Select>
            </Form.Item>
            {/* addresses */}

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
                {
                  type: "string",
                  min: 10,
                  max: 11,
                  message: "Please input your phone number min 10 max11!",
                },
              ]}
            >
              <Input
                addonBefore={prefixSelector}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.Item
              name="fullname"
              label="Full Name"
              rules={[
                {
                  required: true,
                  message: "Please input your company!",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error("Should accept agreement")),
                },
              ]}
            >
              <Checkbox>
                I have read the <Link to="/Register">agreement</Link>
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                className="Register-button"
                type="primary"
                htmlType="submit"
              >
                Register
              </Button>
            </Form.Item>
          </Form>
          <h6 className="Login">
            <Link to="/" className="link">
              Login
            </Link>
          </h6>
        </div>
      </div>
    </>
  );
};

export default Register;
