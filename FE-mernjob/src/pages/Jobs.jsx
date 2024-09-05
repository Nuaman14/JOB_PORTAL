import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearAllJobsErrors, fetchJobs } from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";
import { FaSearch } from "react-icons/fa";
import {Link} from "react-router-dom";

const Jobs = () => {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { jobs, loading, error } = useSelector((state) => state.jobs);

  const handleCityChange = (city) => {
    setCity(city);
    setSelectedCity(city);
  };
  const handleNicheChange = (niche) => {
    setNiche(niche);
    setSelectedNiche(niche);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobsErrors());
    }
    dispatch(fetchJobs(city, niche, searchKeyword));
  }, [dispatch, error, city, niche]);

  const handleSearch = () => {
    dispatch(fetchJobs(city, niche, searchKeyword));
  };

  const cities = ["Mumbai", "Hyderabad", "Thane"];

  const nicheArray = ["Web Development", "Frontend"]

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section className="jobs">
          <div className="search-tab-wrapper">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button onClick={handleSearch}>find Job</button>
            <FaSearch />
          </div>
          <div className="wrapper">
            <div className="filter-bar">
              <div className="cities">
                <h2>Filter Job by City</h2>
                {cities.map((city, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={city}
                      name="city"
                      value={city}
                      checked={selectedCity === city}
                      onChange={() => handleCityChange(city)}
                    />
                    <label htmlFor={city}>{city}</label>
                  </div>
                ))}
              </div>
              <div className="cities">
                <h2>Filter Job by Niche</h2>
                {nicheArray.map((niche, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={niche}
                      name="city"
                      value={niche}
                      checked={selectedNiche === niche}
                      onChange={() => handleNicheChange(niche)}
                    />
                     <label htmlFor={niche}>{niche}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="container">
              <div className="mobile-filter">
                 <select value={city} onChange={(e) =>setCity(e.target.value)}>
                  <option value="">Filter by city</option>
                  {
                    cities.map((city,index) =>(
                      <option value={city} key={index}>{city}</option>
                    ))
                  };
                 </select>
                 <select value={niche} onChange={(e) =>setNiche(e.target.value)}>
                  <option value="">Filter by Niche</option>
                  {
                    nicheArray.map((niche,index) =>(
                      <option value={niche} key={index}>{niche}</option>
                    ))
                  };
                 </select>
              </div>
              <div className="jobs_container">
                {
                  jobs && jobs.map(element=>{
                    return(
                      <div className="card" key={element._id}>
                        {element.hiringMultipleCandidates === "Yes"?(
                          <p className="hiring-multiple">Hiring Multiple Candidate</p>
                        ):
                        (
                          <p className="hiring">Hiring</p>
                        )}
                        <p className="title">{element.title}</p>
                        <p className="company">{element.companyName}</p>
                        <p className="location">{element.location}</p>
                        <p className="salary"> <span>Salary:</span> Rs{element.salary}</p>
                        <p className="posted"><span>Posted On</span>{element.jobPostedOn.substring(0,10)}</p>
                        <div className="btn-wrapper">
                          <Link to={`/post/application/${element._id}`}>Apply Now</Link>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Jobs;
