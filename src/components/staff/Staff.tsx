import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  addStaff,
  getStaffDetails,
  updateClient,
} from "../../redux/actions/staffActions";
import {
  getRootServiceCategory,
  getAllService,updateServiceCategory
} from "../../redux/actions/serviceActions";
import PageHeader from "../core/PageHeader";
import { ColorCode } from "./../../utils/ColorCodeList";
import { StateList } from "./../../utils/StateList";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Form,
  Col,
  Row,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
} from "react-bootstrap";

const Staff = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title, setTitle] = useState("New Staff");
  const history = useHistory();
  const [resultFilterCategory, setResultFilterCategory] = useState([]);
  const [selectedMultiOptions, setSelectedMultiOptions] = useState([]);
  const [selectedMultiParent, setSelectedMultiParent] = useState([]);

   
  const [staff, setStaff] = useState({
    businessId: "",
    color: "",
    countryCode: "",
    displayName: "",
    email: "",
    firstName: "",
    gender: "",
    lastName: "",
    order: 0,
    password: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
    },
    pctOfPayoutCheck: 0,
    pctOfProductSales: 0,
    pctOfServiceSales: 0,
    pctOfTips: 0,
    phoneNumber: "",
    profileCategoryId: [],
    roles: ['stylist'],
    serviceIds: [],
    status: "",
    retypePassword:"",
    changePassword:""
  });

  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const staffInfo = user.staffInfo;
  const service = useSelector((state: any) => state.service);
  const allCategories = service.getRootServiceCategory;
  const allServices = service.serviceDetails;
  const view = window.location.href.includes("view");
  const urlParams = useParams();
  const id = urlParams.id;
  const bussinessId = localStorage.getItem("businessId");

  console.log()

  useEffect(() => {
    let params = {
      businessId: bussinessId,
    };
    if (view) {
      setTitle("Category View/Edit");
      props.getStaffDetails(id, params);
    }
    props.getRootServiceCategory(params);
    props.getAllService(params);
    filterData();
  }, [view]);

  useEffect(() => {
    if (view && Object.keys(staffInfo).length !== 0) {
      if (staffInfo.retypePassword) {
        delete staffInfo.retypePassword;
      }
      setStaff(staffInfo);
    }
  }, [staffInfo]);

  useEffect(() => {
    filterData();
  }, [selectedMultiParent]);

  const handleMultiServices = (selectedItems: any) => {
    const multiOptions: any = [];
    for (let i = 0; i < selectedItems.length; i++) {
      multiOptions.push(selectedItems[i].value);
    }
    setSelectedMultiOptions(multiOptions);
  };

  const handleMultiParent = (selectedItems: any) => {
    const multiOptions: any = [];
    for (let i = 0; i < selectedItems.length; i++) {
      multiOptions.push(selectedItems[i].value);
    }
    setSelectedMultiParent(multiOptions);
    
  };

  const selectAllItems = () => {
    const serviceIds: any = [];
    resultFilterCategory.forEach((value: any) => {
      value.forEach((val:any)=>{
        serviceIds.push(val.id);
      });
    });
    setSelectedMultiOptions(serviceIds);
  };

  const unSelectAllItems = () => {
    const serviceIds: any = [];
    setSelectedMultiOptions(serviceIds);
  };
  


  const handleSubmit = (values: any) => {
    values.businessId = bussinessId;
    values.serviceIds = selectedMultiOptions;
    values.profileCategoryId = selectedMultiParent;

    if (view) {
      if (!values.password) {
        delete values.password;
      }
      history.push("/staff");
      props.updateClient(values, history);
      values.profileCategoryId.forEach((element:any) => {
        const resourcesIds = []
        if (element) {
          const newFliterJob: any = allServices.filter((data: any) => {
            
            return Object.values(data)
              .join(" ")
              .toLocaleLowerCase()
              .includes(element.toLocaleLowerCase());
          });
          resourcesIds.push(newFliterJob);
        }
        const resourceIdValue = resourcesIds[0].map((val:any)=>val.id);
        console.log(resourceIdValue);
        const params:any = {
          businessId : values.businessId,
          id:element,
          resourcesIds : resourceIdValue
        }
        console.log(params)
        props.updateServiceCategory(params, history);
      });
    }

     else {
      props.addStaff(values, history);
      /* const getStaff = user.staffResponseData
      const params:any = {
        businessId : values.businessId,
      } 
      props.updateServiceCategory(params, history); */
      /* props.addStaff(values, history ,(object, (boolean:any, id:any) =>{
        const params:any = {
          businessId : values.businessId,
          id:id,
        }
        props.updateServiceCategory(params, history);
      })) */
    }
  };

  const handleCancel = (e: any) => {
    props.history.push("/staff");
  };

  const filterData = () => {
    const tempArr:any = []
    selectedMultiParent.forEach((value:any) => {
      if (value) {
        const newFliterJob: any = allServices.filter((data: any) => {
          return Object.values(data)
            .join(" ")
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase());
        });
        tempArr.push(newFliterJob);
        setResultFilterCategory(tempArr);
      } else {
        setResultFilterCategory([]);
      }
    });
  };

  const uploadImage = (files: any) => {
    /* const imageToSave = new FormData();
    imageToSave.append("input", files[0]);
    imageToSave.append("upload_present", "asdfghjkl");
    axios.post(); */
  };

  const basicFormSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"), 
    countryCode: yup.string().required("Country Code is required"),
    phoneNumber: yup.string().required("Phone Number is required"),
    displayName: yup.string().required("Display Name is required"),
    email: yup.string().required("Email is required"),
    /* password: yup.string().required("Password is required"), */
    /* address:{
      line1 : yup.string().required("Address Line 1 is required"),
    line2: yup.string().required("line2 is required"),
    city: yup.string().required("city is required"),
    }, */
    order: yup.string().required("Order is required"),
  });

  return (
    <>
      {user.authenticated && !UI.loading ? (
        <>
          <PageHeader title={title} />
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <div className="ibox float-e-margins">
                  <div className="ibox-content">
                    <Formik
                      initialValues={{ ...staff }}
                      validationSchema={basicFormSchema}
                      onSubmit={handleSubmit}
                      enableReinitialize={true}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                      }) => {
                        return (
                          <Form
                            name="Staff"
                            className="form-horizontal"
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                          >
                            <div className="row">
                              <div className="col-md-8">
                                <div className="text-danger m-t-md m-b-md"></div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-8">
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    First Name
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="firstName"
                                      placeholder="Enter First Name"
                                      value={values.firstName}
                                      onChange={handleChange}
                                      /* onChange={(e: any) => {
                                        setFirstName(e.target.value);
                                      }} */
                                      onBlur={handleBlur}
                                       isInvalid={
                                        errors.firstName && touched.firstName
                                      } 
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Last Name
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="lastName"
                                      value={values.lastName}
                                      onChange={handleChange}
                                      placeholder="Enter Last Name"
                                      /* onChange={(e: any) => {
                                        setLastName(e.target.value);
                                      }} */
                                      onBlur={handleBlur}
                                       isInvalid={
                                        errors.lastName && touched.lastName
                                      } 
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Display Name
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="displayName"
                                      placeholder="Enter Display Name"
                                      value={values.displayName}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.displayName &&
                                        touched.displayName
                                      }
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Country Code
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      as="select"
                                      name="countryCode"
                                      value={values.countryCode}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.countryCode &&
                                        touched.countryCode
                                      }
                                    >
                                      <option value="">Select</option>
                                      <option value="+1">USA (+1)</option>
                                      <optgroup label="Other countries">
                                        <option value="+213">
                                          Algeria (+213)
                                        </option>
                                        <option value="+376">
                                          Andorra (+376)
                                        </option>
                                        <option value="+244">
                                          Angola (+244)
                                        </option>
                                        <option value="+1264">
                                          Anguilla (+1264)
                                        </option>
                                        <option value="+1268">
                                          Antigua &amp;Barbuda (+1268)
                                        </option>
                                        <option value="+54">
                                          Argentina (+54)
                                        </option>
                                        <option value="+374">
                                          Armenia (+374)
                                        </option>
                                        <option value="+297">
                                          Aruba (+297)
                                        </option>
                                        <option value="+61">
                                          Australia (+61)
                                        </option>
                                        <option value="+43">
                                          Austria (+43)
                                        </option>
                                        <option value="+994">
                                          Azerbaijan (+994)
                                        </option>
                                        <option value="+1242">
                                          Bahamas (+1242)
                                        </option>
                                        <option value="+973">
                                          Bahrain (+973)
                                        </option>
                                        <option value="+880">
                                          Bangladesh (+880)
                                        </option>
                                        <option value="+1246">
                                          Barbados (+1246)
                                        </option>
                                        <option value="+375">
                                          Belarus (+375)
                                        </option>
                                        <option value="+32">
                                          Belgium (+32){" "}
                                        </option>
                                        <option value="+501">
                                          Belize (+501)
                                        </option>
                                        <option value="+229">
                                          Benin (+229){" "}
                                        </option>
                                        <option value="+1441">
                                          Bermuda (+1441)
                                        </option>
                                        <option value="+975">
                                          Bhutan (+975)
                                        </option>
                                        <option value="+591">
                                          Bolivia (+591)
                                        </option>
                                        <option value="+387">
                                          Bosnia Herzegovina (+387)
                                        </option>
                                        <option value="+267">
                                          Botswana (+267)
                                        </option>
                                        <option value="+55">
                                          Brazil (+55)
                                        </option>
                                        <option value="+673">
                                          Brunei (+673)
                                        </option>
                                        <option value="+359">
                                          Bulgaria (+359)
                                        </option>
                                        <option value="+226">
                                          Burkina Faso (+226)
                                        </option>
                                        <option value="+257">
                                          Burundi (+257)
                                        </option>
                                        <option value="+855">
                                          Cambodia (+855)
                                        </option>
                                        <option value="+237">
                                          Cameroon (+237)
                                        </option>
                                        <option value="+1">Canada (+1)</option>
                                        <option value="+238">
                                          Cape Verde Islands (+238)
                                        </option>
                                        <option value="+1345">
                                          Cayman Islands (+1345)
                                        </option>
                                        <option value="+236">
                                          Central African Republic (+236)
                                        </option>
                                        <option value="+56">Chile (+56)</option>
                                        <option value="+86">China (+86)</option>
                                        <option value="+57">
                                          Colombia (+57)
                                        </option>
                                        <option value="+269">
                                          Comoros (+269)
                                        </option>
                                        <option value="+242">
                                          Congo (+242)
                                        </option>
                                        <option value="+682">
                                          Cook Islands (+682)
                                        </option>
                                        <option value="+506">
                                          Costa Rica (+506)
                                        </option>
                                        <option value="+385">
                                          Croatia (+385)
                                        </option>
                                        <option value="+53">Cuba (+53)</option>
                                        <option value="+90392">
                                          Cyprus North (+90392)
                                        </option>
                                        <option value="+357">
                                          Cyprus South (+357)
                                        </option>
                                        <option value="+42">
                                          Czech Republic (+42)
                                        </option>
                                        <option value="+45">
                                          Denmark (+45)
                                        </option>
                                        <option value="+253">
                                          Djibouti (+253)
                                        </option>
                                        <option value="+1809">
                                          Dominica (+1809)
                                        </option>
                                        <option value="+1809">
                                          Dominican Republic (+1809)
                                        </option>
                                        <option value="+593">
                                          Ecuador (+593)
                                        </option>
                                        <option value="+20">Egypt (+20)</option>
                                        <option value="+503">
                                          El Salvador (+503)
                                        </option>
                                        <option value="+240">
                                          Equatorial Guinea (+240)
                                        </option>
                                        <option value="+291">
                                          Eritrea (+291)
                                        </option>
                                        <option value="+372">
                                          Estonia (+372)
                                        </option>
                                        <option value="+251">
                                          Ethiopia (+251)
                                        </option>
                                        <option value="+500">
                                          Falkland Islands (+500)
                                        </option>
                                        <option value="+298">
                                          Faroe Islands (+298)
                                        </option>
                                        <option value="+679">
                                          Fiji (+679)
                                        </option>
                                        <option value="+358">
                                          Finland (+358)
                                        </option>
                                        <option value="+33">
                                          France (+33)
                                        </option>
                                        <option value="+594">
                                          French Guiana (+594)
                                        </option>
                                        <option value="+689">
                                          French Polynesia (+689)
                                        </option>
                                        <option value="+241">
                                          Gabon (+241)
                                        </option>
                                        <option value="+220">
                                          Gambia (+220)
                                        </option>
                                        <option value="+7880">
                                          Georgia (+7880)
                                        </option>
                                        <option value="+49">
                                          Germany (+49)
                                        </option>
                                        <option value="+233">
                                          Ghana (+233)
                                        </option>
                                        <option value="+350">
                                          Gibraltar (+350)
                                        </option>
                                        <option value="+30">
                                          Greece (+30)
                                        </option>
                                        <option value="+299">
                                          Greenland (+299)
                                        </option>
                                        <option value="+1473">
                                          Grenada (+1473)
                                        </option>
                                        <option value="+590">
                                          Guadeloupe (+590)
                                        </option>
                                        <option value="+671">
                                          Guam (+671)
                                        </option>
                                        <option value="+502">
                                          Guatemala (+502)
                                        </option>
                                        <option value="+224">
                                          Guinea (+224)
                                        </option>
                                        <option value="+245">
                                          Guinea - Bissau (+245)
                                        </option>
                                        <option value="+592">
                                          Guyana (+592)
                                        </option>
                                        <option value="+509">
                                          Haiti (+509)
                                        </option>
                                        <option value="+504">
                                          Honduras (+504)
                                        </option>
                                        <option value="+852">
                                          Hong Kong (+852)
                                        </option>
                                        <option value="+36">
                                          Hungary (+36)
                                        </option>
                                        <option value="+354">
                                          Iceland (+354)
                                        </option>
                                        <option value="+91">India (+91)</option>
                                        <option value="+62">
                                          Indonesia (+62)
                                        </option>
                                        <option value="+98">Iran (+98)</option>
                                        <option value="+964">
                                          Iraq (+964)
                                        </option>
                                        <option value="+353">
                                          Ireland (+353)
                                        </option>
                                        <option value="+972">
                                          Israel (+972)
                                        </option>
                                        <option value="+39">Italy (+39)</option>
                                        <option value="+1876">
                                          Jamaica (+1876)
                                        </option>
                                        <option value="+81">Japan (+81)</option>
                                        <option value="+962">
                                          Jordan (+962)
                                        </option>
                                        <option value="+7">
                                          Kazakhstan (+7)
                                        </option>
                                        <option value="+254">
                                          Kenya (+254)
                                        </option>
                                        <option value="+686">
                                          Kiribati (+686)
                                        </option>
                                        <option value="+850">
                                          Korea North (+850)
                                        </option>
                                        <option value="+82">
                                          Korea South (+82)
                                        </option>
                                        <option value="+965">
                                          Kuwait (+965)
                                        </option>
                                        <option value="+996">
                                          Kyrgyzstan (+996)
                                        </option>
                                        <option value="+856">
                                          Laos (+856)
                                        </option>
                                        <option value="+371">
                                          Latvia (+371)
                                        </option>
                                        <option value="+961">
                                          Lebanon (+961)
                                        </option>
                                        <option value="+266">
                                          Lesotho (+266)
                                        </option>
                                        <option value="+231">
                                          Liberia (+231)
                                        </option>
                                        <option value="+218">
                                          Libya (+218)
                                        </option>
                                        <option value="+417">
                                          Liechtenstein (+417)
                                        </option>
                                        <option value="+370">
                                          Lithuania (+370)
                                        </option>
                                        <option value="+352">
                                          Luxembourg (+352)
                                        </option>
                                        <option value="+853">
                                          Macao (+853)
                                        </option>
                                        <option value="+389">
                                          Macedonia (+389)
                                        </option>
                                        <option value="+261">
                                          Madagascar (+261)
                                        </option>
                                        <option value="+265">
                                          Malawi (+265)
                                        </option>
                                        <option value="+60">
                                          Malaysia (+60)
                                        </option>
                                        <option value="+960">
                                          Maldives (+960)
                                        </option>
                                        <option value="+223">
                                          Mali (+223)
                                        </option>
                                        <option value="+356">
                                          Malta (+356)
                                        </option>
                                        <option value="+692">
                                          Marshall Islands (+692)
                                        </option>
                                        <option value="+596">
                                          Martinique (+596)
                                        </option>
                                        <option value="+222">
                                          Mauritania (+222)
                                        </option>
                                        <option value="+269">
                                          Mayotte (+269)
                                        </option>
                                        <option value="+52">
                                          Mexico (+52)
                                        </option>
                                        <option value="+691">
                                          Micronesia (+691)
                                        </option>
                                        <option value="+373">
                                          Moldova (+373)
                                        </option>
                                        <option value="+377">
                                          Monaco (+377)
                                        </option>
                                        <option value="+976">
                                          Mongolia (+976)
                                        </option>
                                        <option value="+1664">
                                          Montserrat (+1664)
                                        </option>
                                        <option value="+212">
                                          Morocco (+212)
                                        </option>
                                        <option value="+258">
                                          Mozambique (+258)
                                        </option>
                                        <option value="+95">
                                          Myanmar (+95)
                                        </option>
                                        <option value="+264">
                                          Namibia (+264)
                                        </option>
                                        <option value="+674">
                                          Nauru (+674)
                                        </option>
                                        <option value="+977">
                                          Nepal (+977)
                                        </option>
                                        <option value="+31">
                                          Netherlands (+31)
                                        </option>
                                        <option value="+687">
                                          New Caledonia (+687)
                                        </option>
                                        <option value="+64">
                                          New Zealand (+64)
                                        </option>
                                        <option value="+505">
                                          Nicaragua (+505)
                                        </option>
                                        <option value="+227">
                                          Niger (+227)
                                        </option>
                                        <option value="+234">
                                          Nigeria (+234)
                                        </option>
                                        <option value="+683">
                                          Niue (+683)
                                        </option>
                                        <option value="+672">
                                          Norfolk Islands (+672)
                                        </option>
                                        <option value="+670">
                                          Northern Marianas (+670)
                                        </option>
                                        <option value="+47">
                                          Norway (+47)
                                        </option>
                                        <option value="+968">
                                          Oman (+968)
                                        </option>
                                        <option value="+680">
                                          Palau (+680)
                                        </option>
                                        <option value="+507">
                                          Panama (+507)
                                        </option>
                                        <option value="+675">
                                          Papua New Guinea (+675)
                                        </option>
                                        <option value="+595">
                                          Paraguay (+595)
                                        </option>
                                        <option value="+51">Peru (+51)</option>
                                        <option value="+63">
                                          Philippines (+63)
                                        </option>
                                        <option value="+48">
                                          Poland (+48)
                                        </option>
                                        <option value="+351">
                                          Portugal (+351)
                                        </option>
                                        <option value="+1787">
                                          Puerto Rico (+1787)
                                        </option>
                                        <option value="+974">
                                          Qatar (+974)
                                        </option>
                                        <option value="+262">
                                          Reunion (+262)
                                        </option>
                                        <option value="+40">
                                          Romania (+40)
                                        </option>
                                        <option value="+7">Russia (+7)</option>
                                        <option value="+250">
                                          Rwanda (+250)
                                        </option>
                                        <option value="+378">
                                          San Marino (+378)
                                        </option>
                                        <option value="+239">
                                          Sao Tome &amp; Principe (+239)
                                        </option>
                                        <option value="+966">
                                          Saudi Arabia (+966)
                                        </option>
                                        <option value="+221">
                                          Senegal (+221)
                                        </option>
                                        <option value="+381">
                                          Serbia (+381)
                                        </option>
                                        <option value="+248">
                                          Seychelles (+248)
                                        </option>
                                        <option value="+232">
                                          Sierra Leone (+232)
                                        </option>
                                        <option value="+65">
                                          Singapore (+65)
                                        </option>
                                        <option value="+421">
                                          Slovak Republic (+421)
                                        </option>
                                        <option value="+386">
                                          Slovenia (+386)
                                        </option>
                                        <option value="+677">
                                          Solomon Islands (+677)
                                        </option>
                                        <option value="+252">
                                          Somalia (+252)
                                        </option>
                                        <option value="+27">
                                          South Africa (+27)
                                        </option>
                                        <option value="+34">Spain (+34)</option>
                                        <option value="+94">
                                          Sri Lanka (+94)
                                        </option>
                                        <option value="+290">
                                          St. Helena (+290)
                                        </option>
                                        <option value="+1869">
                                          St. Kitts (+1869)
                                        </option>
                                        <option value="+1758">
                                          St. Lucia (+1758)
                                        </option>
                                        <option value="+249">
                                          Sudan (+249)
                                        </option>
                                        <option value="+597">
                                          Suriname (+597)
                                        </option>
                                        <option value="+268">
                                          Swaziland (+268)
                                        </option>
                                        <option value="+46">
                                          Sweden (+46)
                                        </option>
                                        <option value="+41">
                                          Switzerland (+41)
                                        </option>
                                        <option value="+963">
                                          Syria (+963)
                                        </option>
                                        <option value="+886">
                                          Taiwan (+886)
                                        </option>
                                        <option value="+7">
                                          Tajikstan (+7)
                                        </option>
                                        <option value="+66">
                                          Thailand (+66)
                                        </option>
                                        <option value="+228">
                                          Togo (+228)
                                        </option>
                                        <option value="+676">
                                          Tonga (+676)
                                        </option>
                                        <option value="+1868">
                                          Trinidad &amp; Tobago (+1868)
                                        </option>
                                        <option value="+216">
                                          Tunisia (+216)
                                        </option>
                                        <option value="+90">
                                          Turkey (+90)
                                        </option>
                                        <option value="+7">
                                          Turkmenistan (+7)
                                        </option>
                                        <option value="+993">
                                          Turkmenistan (+993)
                                        </option>
                                        <option value="+1649">
                                          Turks &amp; Caicos Islands (+1649)
                                        </option>
                                        <option value="+688">
                                          Tuvalu (+688)
                                        </option>
                                        <option value="+256">
                                          Uganda (+256)
                                        </option>
                                        <option value="+44">UK (+44)</option>
                                        <option value="+380">
                                          Ukraine (+380)
                                        </option>
                                        <option value="+971">
                                          United Arab Emirates (+971)
                                        </option>
                                        <option value="+598">
                                          Uruguay (+598)
                                        </option>
                                        <option value="+7">
                                          Uzbekistan (+7)
                                        </option>
                                        <option value="+678">
                                          Vanuatu (+678)
                                        </option>
                                        <option value="+379">
                                          Vatican City (+379)
                                        </option>
                                        <option value="+58">
                                          Venezuela (+58)
                                        </option>
                                        <option value="+84">
                                          Vietnam (+84)
                                        </option>
                                        <option value="+84">
                                          Virgin Islands - British (+1284)
                                        </option>
                                        <option value="+84">
                                          Virgin Islands - US (+1340)
                                        </option>
                                        <option value="+681">
                                          Wallis &amp; Futuna (+681)
                                        </option>
                                        <option value="+969">
                                          Yemen (North)(+969)
                                        </option>
                                        <option value="+967">
                                          Yemen (South)(+967)
                                        </option>
                                        <option value="+260">
                                          Zambia (+260)
                                        </option>
                                        <option value="+263">
                                          Zimbabwe (+263)
                                        </option>
                                      </optgroup>
                                    </FormControl>
                                  </Col>
                                </FormGroup>

                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Phone Number
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="phoneNumber"
                                      value={values.phoneNumber}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.phoneNumber &&
                                        touched.phoneNumber
                                      }
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Email
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="email"
                                      name="email"
                                      placeholder="Enter E-Mail"
                                      value={values.email}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={errors.email && touched.email}
                                    />
                                  </Col>
                                </FormGroup>
                                {!view && (
                                  <FormGroup>
                                    <FormLabel className="col-sm-3 control-label">
                                      Password
                                    </FormLabel>
                                    <Col sm="9">
                                      <FormControl
                                        type="text"
                                        name="password"
                                        placeholder="Enter Password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                          errors.password && touched.password
                                        }
                                      />
                                    </Col>
                                  </FormGroup>
                                )}
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Gender
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      as="select"
                                      name="gender"
                                      value={values.gender}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      <option value="">Gender</option>
                                      <option
                                        selected={
                                          values.gender === "male"
                                            ? "selected"
                                            : ""
                                        }
                                        value="male"
                                      >
                                        Male
                                      </option>
                                      <option
                                        selected={
                                          values.gender === "female"
                                            ? "selected"
                                            : ""
                                        }
                                        value="female"
                                      >
                                        Female
                                      </option>
                                    </FormControl>
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Role
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      as="select"
                                      name="role"
                                      multiple={true}
                                      value={selectedMultiParent}
                                      onChange={(e) => {
                                        handleMultiParent(
                                          e.target.selectedOptions
                                        );
                                      }}
                                      /* onChange={(e: any) => {
                                        setFilterCategory(e.target.value);
                                      }} */
                                    >
                                      <option value="admin">Admin</option>
                                      {allCategories &&
                                        allCategories.length &&
                                        allCategories.map((value: any) => {
                                          return (
                                            <option value={value.id}>
                                              {value.description} ({value.name})
                                            </option>
                                          );
                                        })}
                                    </FormControl>
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Services
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      as="select"
                                      name="role"
                                      multiple={true}
                                      value={selectedMultiOptions}
                                      onChange={(e) => {
                                        handleMultiServices(
                                          e.target.selectedOptions
                                        );
                                      }}
                                    >
                                      {resultFilterCategory &&
                                        resultFilterCategory.length &&
                                        resultFilterCategory.map(
                                          (value: any) => value.map((val:any) => 
                                            {
                                              return (
                                                <option value={val.id}>
                                                  {val.name}
                                                </option>
                                              );
                                          } )
                                        )}
                                    </FormControl>
                                    <button
                                      className="btn btn-primary"
                                      type="button"
                                      style={{ marginTop: "20px" }}
                                      onClick={selectAllItems}
                                    >
                                      Select All
                                    </button>
                                    &nbsp;
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      style={{ marginTop: "20px" }}
                                      onClick={unSelectAllItems}
                                    >
                                      Un Select All
                                    </button>
                                  </Col>
                                </FormGroup>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <div className="col-sm-12">
                                    <div className="staffAvatar">
                                      <button
                                        className="btn btn-danger btn-remove-staffAvatar"
                                        type="button"
                                      >
                                        X
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label className="col-sm-3 control-label">
                                    Add Avatar
                                  </label>
                                  <div className="col-sm-9">
                                    <input
                                      type="file"
                                      className="form-control"
                                      id="fileToUpload"
                                      onChange={(event) => {
                                        uploadImage(event.target.files);
                                      }}
                                    />
                                    {/* <i className="fa fa-spinner fa-spin spin-on-relative-out" /> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="hr-line-dashed" />
                            <div className="row">
                              <div className="col-md-8">
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Street Adress 1
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="address.line1"
                                      placeholder="Enter Street Adress 1"
                                      value={
                                        values.address && values.address.line1
                                          ? values.address.line1
                                          : ""
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      /* isInvalid={
                                        errors.address.line1 &&
                                        touched.address.line1
                                      } */
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Street Adress 2
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="address.line2"
                                      placeholder="Enter Street Adress 2"
                                      value={
                                        values.address && values.address.line2
                                          ? values.address.line2
                                          : ""
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    City
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="address.city"
                                      placeholder="Enter City"
                                      value={
                                        values.address && values.address.city
                                          ? values.address.city
                                          : ""
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </Col>
                                </FormGroup>
                                <div className="form-group">
                                  <label className="col-sm-3 control-label">
                                    State
                                  </label>
                                  <div className="col-sm-9">
                                    <FormControl
                                      as="select"
                                      name="address.state"
                                      value={
                                        values.address && values.address.state
                                          ? values.address.state
                                          : ""
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      <option value="">-- Choose State</option>
                                      {StateList.map((e, index) => (
                                        <option
                                          key={index}
                                          aria-selected={
                                            values.address &&
                                            values.address.state &&
                                            values.address.state === e.full
                                              ? true
                                              : false
                                          }
                                          selected={
                                            values.address &&
                                            values.address.state &&
                                            values.address.state === e.full
                                              ? true
                                              : false
                                          }
                                          value={e.full}
                                        >
                                          {e.full}
                                        </option>
                                      ))}
                                    </FormControl>
                                  </div>
                                </div>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Zip (postal code)
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="address.postal_code"
                                      placeholder="Enter Postal Code"
                                      value={values.address.postal_code}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Schedule color
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      as="select"
                                      name="color"
                                      value={values.color}
                                      /* onChange={(e: any) => {
                                        setColorCode(e.target.value);
                                      }} */
                                      onChange={handleChange} 
                                      onBlur={handleBlur}
                                    >
                                      <option value="#43B394">--</option>
                                      {ColorCode &&
                                        ColorCode.length &&
                                        ColorCode.map((value) => {
                                          return (
                                            <option
                                              value={value.hex}
                                              style={{ background: value.rgb }}
                                            >
                                              {value.name}
                                            </option>
                                          );
                                        })}
                                    </FormControl>
                                    <div
                                      style={{
                                        padding: "10px",
                                        marginTop: "10px",
                                        backgroundColor: values.color,
                                        color: "#FFF",
                                      }}
                                    >{values.firstName} {values.lastName}</div>
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Order
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="number"
                                      name="order"
                                      value={values.order}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={errors.order && touched.order}
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Status
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      as="select"
                                      name="status"
                                      value={values.status}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      <option value="">Status</option>
                                      <option
                                        selected={
                                          values.status === "active"
                                            ? "selected"
                                            : ""
                                        }
                                        value="active"
                                      >
                                        Active
                                      </option>
                                      <option
                                        selected={
                                          values.status === "inactive"
                                            ? "selected"
                                            : ""
                                        }
                                        value="inactive"
                                      >
                                        Inactive
                                      </option>
                                    </FormControl>
                                  </Col>
                                </FormGroup>
                              </div>
                            </div>

                            {view && (
                              <React.Fragment>
                                <div className="hr-line-dashed"></div>
                                <div className="row">
                                  <div className="col-md-8">
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        % of Payout - Check
                                      </FormLabel>
                                      <Col sm="9">
                                        <FormControl
                                          type="number"
                                          name="pctOfPayoutCheck"
                                          placeholder="% of Payout - Check"
                                          value={values.pctOfPayoutCheck}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          min="0"
                                          max="100"
                                        />
                                      </Col>
                                    </FormGroup>
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        % of Service Sales
                                      </FormLabel>
                                      <Col sm="9">
                                        <FormControl
                                          type="number"
                                          name="pctOfServiceSales"
                                          placeholder="% of Payout - Check"
                                          value={values.pctOfServiceSales}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          min="0"
                                          max="100"
                                        />
                                      </Col>
                                    </FormGroup>
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        % of Product Sales
                                      </FormLabel>
                                      <Col sm="9">
                                        <FormControl
                                          type="number"
                                          name="pctOfProductSales"
                                          placeholder="% of Payout - Check"
                                          value={values.pctOfProductSales}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          min="0"
                                          max="100"
                                        />
                                      </Col>
                                    </FormGroup>
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        % of Tips
                                      </FormLabel>
                                      <Col sm="9">
                                        <FormControl
                                          type="number"
                                          name="pctOfTips"
                                          placeholder="% of Payout - Check"
                                          value={values.pctOfTips}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          min="0"
                                          max="100"
                                        />
                                        {values.pctOfTips > 100 }
                                         
                                      </Col>
                                    </FormGroup>
                                  </div>
                                </div>
                                <div className="hr-line-dashed"></div>
                                <div className="row">
                                  <div className="col-md-8">
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        Change Password (if needs only)
                                      </FormLabel>
                                      <Col sm="9">
                                        <FormControl
                                          type="text"
                                          name="changePassword"
                                          placeholder="Change Password (if needs only)"
                                          value={values.changePassword}
                                          onChange={handleChange}
                                         /*  onChange={(e: any) => {
                                            setChangePassword(e.target.value);
                                          }} */
                                          onBlur={handleBlur}
                                        />
                                      </Col>
                                    </FormGroup>
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        Retype password
                                      </FormLabel>
                                      <Col sm="9">
                                        <FormControl
                                          type="text"
                                          name="retypePassword"
                                          placeholder="Retype password"
                                          value={values.retypePassword}
                                          onChange={handleChange}
                                          /* onChange={(e: any) => {
                                            setRetypePassword(e.target.value);
                                          }} */
                                          onBlur={handleBlur}
                                        />
                                        <span
                                          id="message"
                                          style={{ color: "red" }}
                                        >
                                          {values.changePassword && !values.retypePassword && "type retype password"}
                                          {!values.changePassword && values.retypePassword && "type change password" }
                                          {values.changePassword &&
                                            values.retypePassword &&
                                            values.changePassword !== values.retypePassword &&
                                            "Change password and Retype password is not matching"}
                                        </span>
                                      </Col>
                                    </FormGroup>
                                  </div>
                                </div>
                              </React.Fragment>
                            )}
                            <div className="hr-line-dashed" />
                            <Row>
                              <Col md="8">
                                <FormGroup>
                                  <Col sm="8" className="col-sm-offset-4">
                                    <Button
                                      variant="white"
                                      type="button"
                                      onClick={(e) => handleCancel(e)}
                                    >
                                      Cancel
                                    </Button>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                      Save Changes
                                      {UI.buttonLoading && (
                                        <i className="fa fa-spinner fa-spin"></i>
                                      )}
                                    </Button>
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Form>
                        );
                      }}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const mapActionsToProps = {
  addStaff,
  getStaffDetails,
  updateClient,
  getRootServiceCategory,
  getAllService,updateServiceCategory
};

export default connect(null, mapActionsToProps)(Staff);
