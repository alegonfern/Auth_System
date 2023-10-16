const getState = ({ getStore, getActions, setStore }) => {
	return {
	  store: {
		message: null,
		token:null,
	
		demo: [
		  {
			title: "FIRST",
			background: "white",
			initial: "white",
		  },
		  {
			title: "SECOND",
			background: "white",
			initial: "white",
		  },
		],
	  },
	  actions: {
		// Use getActions to call a function within a fuction
		exampleFunction: () => {
			getActions().changeColor(0, "green");
		},

		getMessage: async () => {
			try{
				// fetching data from the backend
				const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
				const data = await resp.json()
				setStore({ message: data.message })
				// don't forget to return something, that is how the async resolves
				return data;
			}catch(error){
				console.log("Error loading message from backend", error)
			}
		},
		
		syncTokenFromSessionStore: () => {
			const token = sessionStorage.getItem("token");
			const user = sessionStorage.getItem("user");
			const idUser = sessionStorage.getItem("idUser");
			if (token && token != "" && token != undefined) {
				setStore({ token: token, user: user, idUser: idUser })
			}
		},

		login: async (credentials) => {
			try {
				console.log(credentials);
				const resp = await fetch(process.env.BACKEND_URL + "/api/login",
					{
						method: "POST", // *GET, POST, PUT, DELETE, etc.
						mode: "cors", // no-cors, *cors, same-origin
						headers: {
							"Content-Type": "application/json",
							// 'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: JSON.stringify(credentials) // body data type must match "Content-Type" header
					});
				const data = await resp.json();
				console.log(resp.status);
				if (resp.status != 200) return false;
				console.log(data);
				sessionStorage.setItem('token', data.access_token);
				sessionStorage.setItem('user', data.user);
				sessionStorage.setItem('idUser', data.idUser);
				setStore({ token: data.access_token, user: data.user, idUser: data.idUser });
				// don't forget to return something, that is how the async resolves
				return true;
			} catch (error) {
				console.log("Error loading message from backend", error);
				setStore({ token: null, user: null, idUser: null });
				sessionStorage.removeItem('token');
				sessionStorage.removeItem('user');
				sessionStorage.removeItem('idUser');
			}
		},

		  logout: () => {
			  sessionStorage.removeItem('token');
			  sessionStorage.removeItem('user');
			  setStore({
				  token: null,
				  user: null,
			  });
		  },

		newUser: async (user) => {
			let data = "";
			console.log(user);
			const respUser = await fetch(process.env.BACKEND_URL + "/api/signup", {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user) // body data type must match "Content-Type" header
			})
			data = await respUser.json();
			console.log(respUser);
			if (respUser.status != 200) return false;
			return true;
		},

		gotopage: (toPage) => {
			const store = getStore();
			if (!store.token) {
				return "/login";
			}else{
				return toPage;
			}
		},
	}
};
};
  export default getState;
  
  
  
  