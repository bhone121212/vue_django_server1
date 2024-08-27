import axios from 'axios';

const instance = axios.create({
	  baseURL: 'http://43.231.66.174:8000',
	  headers: {
		      'Content-Type': 'application/json',
		    },
});

export default instance;
