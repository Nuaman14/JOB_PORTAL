import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,Link } from "react-router-dom";
import { clearAllUserErrors, register } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import { FaAddressBook, FaPencilAlt, FaRegUser } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdCategory, MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";


const Register = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstNiche, setFirstNiche] = useState("");
  const [secondNiche, setSecondNiche] = useState("");
  const [thirdNiche, setThirdNiche] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");

  const nicheArray = ["web development", "FrontEnd", "Backend"];

  const resumeHandler = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const { loading, isAuthenticated, error, message } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("role", role);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("password", password);
    if (role === "Job-seeker") {
      formData.append("firstNiche", firstNiche);
      formData.append("secondNiche", secondNiche);
      formData.append("thirdNiche", thirdNiche);
      formData.append("coverLetter", coverLetter);
      formData.append("resume", resume);
    }
    dispatch(register(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
      if (isAuthenticated) {
        navigateTo("/");
      
    }
  }, [dispatch, loading, error, isAuthenticated, message]);

  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <h3>Create a New Account</h3>
          </div>
          <form onSubmit={handleRegister}>
            <div className="wrapper">
              <div className="inputTag">
                <label>Register As</label>
                <div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Register As a Admin</option>
                    <option value="Job-seeker">Register As a Job-seeker</option>
                  </select>
                  <FaRegUser />
                </div>
              </div>
              <div className="inputTag">
                <label>Name</label>
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <FaPencilAlt />
                </div>
              </div>
            </div>
            <div className="wrapper">
              <div className="inputTag">
                <label>Email Address</label>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <MdOutlineMailOutline />
                </div>
              </div>
              <div className="inputTag">
                <label>Phone Number</label>
                <div>
                  <input
                    type="number"
                    placeholder="Your number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <FaPhoneFlip />
                </div>
              </div>
            </div>
            <div className="wrapper">
              <div className="inputTag">
                <label>Address</label>
                <div>
                  <input
                    type="text"
                    placeholder="Your Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <FaAddressBook />
                </div>
              </div>
              <div className="inputTag">
                <label>Password</label>
                <div>
                  <input
                    type="password"
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <RiLock2Fill />
                </div>
              </div>
            </div>
            {role === "Job-seeker" && (
              <>
                <div className="wrapper">
                  <div className="inputTag">
                    <label>Your firstNiche</label>
                    <div>
                      <select
                        value={firstNiche}
                        onChange={(e) => setFirstNiche(e.target.value)}
                      >
                        <option value="">Your Niches</option>
                        {nicheArray.map((niche, index) => (
                          <option key={index} value={niche}>
                            {niche}
                          </option>
                        ))}
                      </select>
                      <MdCategory />
                    </div>
                  </div>
                  <div className="inputTag">
                    <label>Your second Niche</label>
                    <div>
                      <select
                        value={secondNiche}
                        onChange={(e) => setSecondNiche(e.target.value)}
                      >
                        <option value="">Your Niches</option>
                        {nicheArray.map((niche, index) => (
                          <option key={index} value={niche}>
                            {niche}
                          </option>
                        ))}
                      </select>
                      <MdCategory />
                    </div>
                  </div>
                  <div className="inputTag">
                    <label>Your Third Niche</label>
                    <div>
                      <select
                        value={thirdNiche}
                        onChange={(e) => setThirdNiche(e.target.value)}
                      >
                        <option value="">Your Niches</option>
                        {nicheArray.map((niche, index) => (
                          <option key={index} value={niche}>
                            {niche}
                          </option>
                        ))}
                      </select>
                      <MdCategory />
                    </div>
                  </div>
                </div>
                <div className="wrapper">
                  <div className="inputTag">
                    <label>CoverLetter</label>
                    <div>
                      <textarea
                        type="text"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={10}
                      />
                    </div>
                  </div>
                </div>
                <div className="wrapper">
                  <div className="inputTag">
                    <label>Resume</label>
                    <div>
                      <input
                        type="file"
                        onChange={resumeHandle}
                        style={{ border: "none" }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <button type="submit" disabled={loading}>Register</button>
            <Link to={"/login"}>Login Now</Link>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
