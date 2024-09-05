import {createSlice} from "@reduxjs/toolkit"
import axios from 'axios'

const jobslice = createSlice({
    name: "jobs",
    initialState:{
        jobs:[],
        loading:false,
        error:null,
        message: null,
        singleJobs:{},
        myJobs: [],
    },
    reducers:{
        requestForAllJobs(state,action){
          state.loading=true;
          state.error= null;
        },
    
    successForAllJobs(state,action){
      state.loading = false;
      state.jobs = action.payload;
      state.error= null;
    },
    
    failureForAllJobs(state,action){
      state.loading = false;
      state.error= action.payload;
    },
    clearAllErrors(state,action){
      state.error = null;
      state.jobs = state.jobs;
    },
    resetJobSlice(state,action){
        state.error = null;
        state.jobs = state.jobs;
        state.loading = false;
        state.message = null;
        state.myJobs = state.myJobs;
        state.singleJobs = {};
    }
},
});

export const  fetchJobs = (city,niche,searchKeyword) =>async (dispatch)=>{
    try {
        dispatch(jobslice.actions.requestForAllJobs());
        let link= "http://localhost:4000/api/v1/job/getall?";
        let queryParams = [];
        if(searchKeyword){
            queryParams.push(`searchKeyword=${searchKeyword}`)
        }
        if(city){
            queryParams.push(`city=${city}`)
        }
        if(niche){
            queryParams.push(`niche=${niche}`)
        }

       link+= queryParams.join("&");
       const response = await axios.get(link,{withCredentials:true});
       dispatch(jobslice.actions.successForAllJobs(response.data.jobs));
       dispatch(jobslice.actions.clearAllErrors());
    } catch (error) {
        dispatch(jobslice.actions.failureForAllJobs(error.response.data.message))
    }
};

export const clearAllJobsErrors =() => (dispatch)=>{
    dispatch(jobslice.actions.clearAllErrors());
}

export const resetJobSlice = () => (dispatch) =>{
    dispatch(jobslice.actions.resetJobSlice());
}


export default jobslice.reducer;