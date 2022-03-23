import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import LocationSearchModal from "../../LocationSearchModal";
import {useParams} from "react-router-dom";

let illegalUserName = /\W/;
let validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
let validName = /^[A-Za-z]+$/;
let ValidContact = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
let ValidPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;

function EditProfile() {
  const token = reactLocalStorage.get("token");
  const [loading, setLoading] = useState(false);
  let { id } = useParams();
  const [formdata, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    firstname: "",
    lastname: "",
    age: "",
    housenumber: "",
    streetnumber: "",
    city: "",
    state: "",
    postalcode: "",
    country: "",
    contact: "",
    gender: "",
    avatar: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState({
    id: "",
    name: "",
    email: "",
    firstname: "",
    lastname: "",
    age: "",
    housenumber: "",
    streetnumber: "",
    city: "",
    state: "",
    postalcode: "",
    country: "",
    contact: "",
    gender: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState('');
  const [oldEmail, setOldEmail] = useState('');

  useEffect(() => {
    setLoading(true);
    let getUserData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/borrower/edit/`,{
          headers: {
            token: token,
          }
        })
        .then((response) => {
          if (response.data) {
            setFormData(response.data.result[0]);
            setOldEmail(response.data.result[0].email);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, [success]);


    const changePosition = (latitude, longitude) => {
    setFormData((prevState) => ({
      ...prevState,
      latitude: latitude,
      longitude:longitude,
    }));
  };

 const handlePhoto = (e) => {
     setFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    switch (name) {
      // checking user name
      case "name":
        if (value.length < 5) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "User Name length must be atleast 5 characters",
          }));
        } else if (value.length > 18) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "User Name must not exceed 18 characters",
          }));
        } else if (illegalUserName.test(value)) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "The username contains illegal characters.",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        }
        break;
      // checking email
      case "email":
        if (!value.match(validEmail)) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Invalid Email",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        }
        break;
      // checking first name
      case "firstname":
        if (value.length < 3) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "First Name length must be atleast 3 characters",
          }));
        } else if (value.length > 15) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "First Name must not exceed 15 characters",
          }));
        } else if (!value.match(validName)) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "The First Name contains illegal characters.",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        }
        break;
      // checking last name
      case "lastname":
        if (value.length < 3) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Last Name length must be atleast 3 characters",
          }));
        } else if (value.length > 15) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Last Name must not exceed 15 characters",
          }));
        } else if (!value.match(validName)) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "The Last Name contains illegal characters.",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        }
        break;
      // checking Contact
      case "contact":
        if (!value.match(ValidContact)) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Invalid Contact",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        }
        break;

      // checking Contact
      case "country":
        if (value != "null") {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Please Select a Country",
          }));
        }
        break;

      // checking City
      case "city":
        if (value.length < 3) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "City length must be atleast 3 characters",
          }));
        } else if (value.length > 20) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "City Lenght must not exceed 20 characters",
          }));
        } else if (!value.match(validName)) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "City Contains illegal characters.",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        }
        break;
        
      case "age":
        if (value > 3 && value < 60) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));     
        }else {
           setErrors((prevState) => ({
            ...prevState,
            [name]: "Invalid Age",
          }));
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formdata.country === "null") {
      errors.country = "Please Select a Country";
    } else if (
      errors.name === "" &&
      errors.email === "" &&
      errors.firstname === "" &&
      errors.lastname === "" &&
      errors.age === "" &&
      errors.city === "" &&
      errors.country === "" &&
      errors.contact === "" &&
      errors.gender === ""
    ) {

      const fd = new FormData();
      fd.append("id", formdata.id);
      fd.append("name", formdata.name);
      fd.append("email", formdata.email);
      fd.append("password", formdata.password);
      fd.append("firstname", formdata.firstname);
      fd.append("lastname", formdata.lastname);
      fd.append("age", formdata.age);
      fd.append("housenumber", formdata.housenumber);
      fd.append("streetnumber", formdata.streetnumber);
      fd.append("city", formdata.city);
      fd.append("state", formdata.state);
      fd.append("postalcode", formdata.postalcode);
      fd.append("country", formdata.country);
      fd.append("contact", formdata.contact);
      fd.append("gender", formdata.gender);
      fd.append('file', file);
      fd.append("avatar", formdata.avatar);
      fd.append("latitude", formdata.latitude);
      fd.append("longitude", formdata.longitude);
      fd.append("oldEmail", oldEmail);

      await axios.put(`${process.env.React_App_Url}/borrower/update/`, fd, {
          headers: {
            token: token,
            "Content-Type": "multipart/form-data",
          },
        }).then(
        (response) => {
          if (response.data.success) {
     setSuccess(response.data.success);
            setFormData((prevState) => ({
            ...prevState,
              avatar:response.data.avatar,
              })); 
                   } else if (response.data.error) {
            setError(response.data.error);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  return (
    <div id="content" className="mx-5">
      <div className="text-center my-5 ">
        <h2>Edit Borrower Profile</h2>
      </div>
      <form onSubmit={handleSubmit} className="needs-validation">
        <div className="row">
          <div className="form-group col-md-3">
            <label for="name">User Name</label>
            <input
              type="text"
              name="name"
              className={`form-control input ${errors.name ? "is-invalid" : ""}`}
              id="name"
              placeholder="User Name"
              onChange={handleChange}
              value={formdata.name}
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          <div className="form-group col-md-3">
            <label for="email">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control input ${errors.email ? "is-invalid" : ""}`}
              id="email"
              placeholder="Email"
              onChange={handleChange}
              value={formdata.email}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="form-group col-md-3">
            <label for="firstname">First Name</label>
            <input
              type="text"
              name="firstname"
              className={`form-control input ${errors.firstname ? "is-invalid" : ""}`}
              id="firstname"
              placeholder="First Name"
              onChange={handleChange}
              value={formdata.firstname}
              required
            />
            {errors.firstname && (
              <div className="invalid-feedback">{errors.firstname}</div>
            )}
          </div>
          <div className="form-group col-md-3">
            <label for="lastname">Last Name</label>
            <input
              type="text"
              name="lastname"
              className={`form-control input ${errors.lastname ? "is-invalid" : ""}`}
              id="lastname"
              placeholder="last Name"
              onChange={handleChange}
              value={formdata.lastname}
              required
            />
            {errors.lastname && (
              <div className="invalid-feedback">{errors.lastname}</div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-3">
            <label for="age">Age</label>
            <input
              name="age"
              className={`form-control input ${errors.age ? "is-invalid" : ""}`}
              type="number"
              placeholder="Age"
              id="age"
              onChange={handleChange}
              value={formdata.age}
              required
            />
             {errors.age && (
              <div className="invalid-feedback">{errors.age}</div>
            )}
          </div>
           <div className="form-group col-md-3">
              <label for="contact">Contact Number</label>
              <input
                type="text"
                name="contact"
                className={`form-control input ${errors.contact ? "is-invalid" : ""}`}
                id="contact"
                placeholder="Contact Number"
                onChange={handleChange}
                value={formdata.contact}
                required
              />
              {errors.contact && (
                <div className="invalid-feedback">{errors.contact}</div>
              )}
            </div>   
          <div className="form-group col-md-3">
            <label for="housenumber">House Number</label>
            <input
              type="text"
              name="housenumber"
              className="form-control input"
              id="housenumber"
              placeholder="House Number"
              onChange={handleChange}
              value={formdata.housenumber}
            />
          </div>
          <div className="form-group col-md-3">
            <label for="streetnumber">Street Number</label>
            <input
              type="text"
              name="streetnumber"
              className="form-control input"
              id="streetnumber"
              placeholder="Street Number"
              onChange={handleChange}
              value={formdata.streetnumber}
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-3">
            <label for="state">State</label>
            <input
              type="text"
              name="state"
              className="form-control input"
              id="state"
              placeholder="State"
              onChange={handleChange}
              value={formdata.state}
            />
          </div>
          <div className="form-group col-md-3">
            <label for="postalcode">Postal Code</label>
            <input
              type="text"
              name="postalcode"
              className="form-control input"
              id="postalcode"
              placeholder="Postal Code"
              onChange={handleChange}
              value={formdata.postalcode}
              required
            />
          </div>
          <div className="form-group col-md-3">
            <label for="city">City</label>
            <input
              type="text"
              name="city"
              className={`form-control input ${errors.city ? "is-invalid" : ""}`}
              id="city"
              placeholder="City"
              onChange={handleChange}
              value={formdata.city}
              required
            />
            {errors.city && (
              <div className="invalid-feedback">{errors.city}</div>
            )}
          </div>
          <div className="form-group col-md-3">
            <label for="country">Country</label>
            <select
              id="country"
              name="country"
              className={`form-control input ${errors.country ? "is-invalid" : ""}`}
              value={formdata.country}
              onChange={handleChange}
            >
              <option value="null">Select a Country</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Åland Islands">Åland Islands</option>
              <option value="Albania">Albania</option>
              <option value="Algeria">Algeria</option>
              <option value="American Samoa">American Samoa</option>
              <option value="Andorra">Andorra</option>
              <option value="Angola">Angola</option>
              <option value="Anguilla">Anguilla</option>
              <option value="Antarctica">Antarctica</option>
              <option value="Antigua and Barbuda">Antigua and Barbuda</option>
              <option value="Argentina">Argentina</option>
              <option value="Armenia">Armenia</option>
              <option value="Aruba">Aruba</option>
              <option value="Australia">Australia</option>
              <option value="Austria">Austria</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Bahamas">Bahamas</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Barbados">Barbados</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Belize">Belize</option>
              <option value="Benin">Benin</option>
              <option value="Bermuda">Bermuda</option>
              <option value="Bhutan">Bhutan</option>
              <option value="Bolivia">Bolivia</option>
              <option value="Bosnia and Herzegovina">
                Bosnia and Herzegovina
              </option>
              <option value="Botswana">Botswana</option>
              <option value="Bouvet Island">Bouvet Island</option>
              <option value="Brazil">Brazil</option>
              <option value="British Indian Ocean Territory">
                British Indian Ocean Territory
              </option>
              <option value="Brunei Darussalam">Brunei Darussalam</option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cambodia">Cambodia</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Canada">Canada</option>
              <option value="Cape Verde">Cape Verde</option>
              <option value="Cayman Islands">Cayman Islands</option>
              <option value="Central African Republic">
                Central African Republic
              </option>
              <option value="Chad">Chad</option>
              <option value="Chile">Chile</option>
              <option value="China">China</option>
              <option value="Christmas Island">Christmas Island</option>
              <option value="Cocos (Keeling) Islands">
                Cocos (Keeling) Islands
              </option>
              <option value="Colombia">Colombia</option>
              <option value="Comoros">Comoros</option>
              <option value="Congo">Congo</option>
              <option value="Congo, The Democratic Republic of The">
                Congo, The Democratic Republic of The
              </option>
              <option value="Cook Islands">Cook Islands</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Cote D'ivoire">Cote D'ivoire</option>
              <option value="Croatia">Croatia</option>
              <option value="Cuba">Cuba</option>
              <option value="Cyprus">Cyprus</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Denmark">Denmark</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Dominica">Dominica</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Egypt">Egypt</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Estonia">Estonia</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Falkland Islands (Malvinas)">
                Falkland Islands (Malvinas)
              </option>
              <option value="Faroe Islands">Faroe Islands</option>
              <option value="Fiji">Fiji</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="French Guiana">French Guiana</option>
              <option value="French Polynesia">French Polynesia</option>
              <option value="French Southern Territories">
                French Southern Territories
              </option>
              <option value="Gabon">Gabon</option>
              <option value="Gambia">Gambia</option>
              <option value="Georgia">Georgia</option>
              <option value="Germany">Germany</option>
              <option value="Ghana">Ghana</option>
              <option value="Gibraltar">Gibraltar</option>
              <option value="Greece">Greece</option>
              <option value="Greenland">Greenland</option>
              <option value="Grenada">Grenada</option>
              <option value="Guadeloupe">Guadeloupe</option>
              <option value="Guam">Guam</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Guernsey">Guernsey</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-bissau">Guinea-bissau</option>
              <option value="Guyana">Guyana</option>
              <option value="Haiti">Haiti</option>
              <option value="Heard Island and Mcdonald Islands">
                Heard Island and Mcdonald Islands
              </option>
              <option value="Holy See (Vatican City State)">
                Holy See (Vatican City State)
              </option>
              <option value="Honduras">Honduras</option>
              <option value="Hong Kong">Hong Kong</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran, Islamic Republic of">
                Iran, Islamic Republic of
              </option>
              <option value="Iraq">Iraq</option>
              <option value="Ireland">Ireland</option>
              <option value="Isle of Man">Isle of Man</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Japan">Japan</option>
              <option value="Jersey">Jersey</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kenya">Kenya</option>
              <option value="Kiribati">Kiribati</option>
              <option value="Korea, Democratic People's Republic of">
                Korea, Democratic People's Republic of
              </option>
              <option value="Korea, Republic of">Korea, Republic of</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Lao People's Democratic Republic">
                Lao People's Democratic Republic
              </option>
              <option value="Latvia">Latvia</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libyan Arab Jamahiriya">
                Libyan Arab Jamahiriya
              </option>
              <option value="Liechtenstein">Liechtenstein</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Macao">Macao</option>
              <option value="Macedonia, The Former Yugoslav Republic of">
                Macedonia, The Former Yugoslav Republic of
              </option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mali">Mali</option>
              <option value="Malta">Malta</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Martinique">Martinique</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mayotte">Mayotte</option>
              <option value="Mexico">Mexico</option>
              <option value="Micronesia, Federated States of">
                Micronesia, Federated States of
              </option>
              <option value="Moldova, Republic of">Moldova, Republic of</option>
              <option value="Monaco">Monaco</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Myanmar">Myanmar</option>
              <option value="Namibia">Namibia</option>
              <option value="Nauru">Nauru</option>
              <option value="Nepal">Nepal</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Netherlands Antilles">Netherlands Antilles</option>
              <option value="New Caledonia">New Caledonia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Niue">Niue</option>
              <option value="Norfolk Island">Norfolk Island</option>
              <option value="Northern Mariana Islands">
                Northern Mariana Islands
              </option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palau">Palau</option>
              <option value="Palestinian Territory, Occupied">
                Palestinian Territory, Occupied
              </option>
              <option value="Panama">Panama</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Philippines">Philippines</option>
              <option value="Pitcairn">Pitcairn</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Puerto Rico">Puerto Rico</option>
              <option value="Qatar">Qatar</option>
              <option value="Reunion">Reunion</option>
              <option value="Romania">Romania</option>
              <option value="Russian Federation">Russian Federation</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Helena">Saint Helena</option>
              <option value="Saint Kitts and Nevis">
                Saint Kitts and Nevis
              </option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Pierre and Miquelon">
                Saint Pierre and Miquelon
              </option>
              <option value="Saint Vincent and The Grenadines">
                Saint Vincent and The Grenadines
              </option>
              <option value="Samoa">Samoa</option>
              <option value="San Marino">San Marino</option>
              <option value="Sao Tome and Principe">
                Sao Tome and Principe
              </option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Senegal">Senegal</option>
              <option value="Serbia">Serbia</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Singapore">Singapore</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Georgia and The South Sandwich Islands">
                South Georgia and The South Sandwich Islands
              </option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Svalbard and Jan Mayen">
                Svalbard and Jan Mayen
              </option>
              <option value="Swaziland">Swaziland</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Syrian Arab Republic">Syrian Arab Republic</option>
              <option value="Taiwan, Province of China">
                Taiwan, Province of China
              </option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Tanzania, United Republic of">
                Tanzania, United Republic of
              </option>
              <option value="Thailand">Thailand</option>
              <option value="Timor-leste">Timor-leste</option>
              <option value="Togo">Togo</option>
              <option value="Tokelau">Tokelau</option>
              <option value="Tonga">Tonga</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Turkey">Turkey</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Turks and Caicos Islands">
                Turks and Caicos Islands
              </option>
              <option value="Tuvalu">Tuvalu</option>
              <option value="Uganda">Uganda</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="United States Minor Outlying Islands">
                United States Minor Outlying Islands
              </option>
              <option value="Uruguay">Uruguay</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Vanuatu">Vanuatu</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Viet Nam">Viet Nam</option>
              <option value="Virgin Islands, British">
                Virgin Islands, British
              </option>
              <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
              <option value="Wallis and Futuna">Wallis and Futuna</option>
              <option value="Western Sahara">Western Sahara</option>
              <option value="Yemen">Yemen</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </select>

            {errors.country && (
              <div className="invalid-feedback">{errors.country}</div>
            )}
          </div>
        </div>

          <div className="row">
            <div className="form-group col-md-6 mt-1 ">
                <div className="row d-flex align-items-center">
                  <div className="form-group col-md-5">
                      <div style={{width:"100%"}}>
                        <img src={`${process.env.React_App_Url}/uploads/${formdata.avatar}`} alt={formdata.name} style={{width:"100%"}}/>
                      </div>
                  </div>
                 <div className="form-group col-md-7 mt-5">
                  <label for="avatar"> Profile Photo </label>
                  <br />
                  <input
                    id="avatar"
                    type="file"
                    name="avatar"
                    className="form-control-file input"
                    onChange={handlePhoto}
                  />
                  </div> 
                </div>
            </div>
           


          <div className="form-group col-md-6">
            <p style={{ marginBottom: "2px" }}>Gender</p>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="male"
                value="male"
                onChange={handleChange}
                required
                checked={formdata.gender === 'male'}
                
              />
              <label className="form-check-label" for="male">
                Male
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="female"
                value="female"
                onChange={handleChange}
                required
                checked={formdata.gender === 'female'}
              />
              <label className="form-check-label" for="female" value="female">
                Female
              </label>
            </div>
          </div>









          </div>

            <div className="row">
          <div className="form-group col-md-12">
            <div
              className="form-control input btn btn-outline-dark"
              data-toggle="modal"
              data-target="#location"
            >
              Change Borrower Location
            </div>
          </div>
        </div>

        <div className="row">
          {success && (
            <div className="form-group col-md-12">
              <div class="alert alert-primary" role="alert">
                {success}
              </div>
            </div>
          )}
          {error && (
            <div className="form-group col-md-12">
              <div class="alert alert-warning" role="alert">
                {error}
              </div>
            </div>
          )}
          <div className="form-group col-md-12">
            <button type="submit" className="form-control input btn btn-outline-dark">
              Submit
            </button>
          </div>
        </div>
      </form>
      <div
        className="modal fade"
        id="location"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-full modal-dialog-centered mt-0 mb-0"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Choose your Location
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="col-md-12">
                <LocationSearchModal changePosition={changePosition} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
