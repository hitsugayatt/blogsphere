import { SignupInput } from "@hitsugaya/blogsite-common";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import {BACKEND_URL} from '../config'

export const Auth = ({type}: {type: "signup" | "signin"}) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name : "",
        username : "",
        password : ""
    });

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signin" ? "signin" : "signup"}`, postInputs);
            const jwt = response.data;
            localStorage.setItem("token", jwt)
            navigate("/blogs")
        } catch(e) {
            // alert the user that the inputs are wrong
            alert("error while signing up");
        } 
    }
    
    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                {/* {JSON.stringify(postInputs)} */}
                <div className="px-10">
                    <div className="text-3xl font-extrabold">
                        {type === "signin" ? "Enter your credentials" : "Create an account"}
                    </div>
                    <div className="text-slate-400">
                        {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                        <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                            {type === "signin" ? "Signup" : "Login"}
                        </Link>
                    </div>
                </div>
                <div className="pt-3">
                    {type === "signup" ? <LabelledInput label="Name" placeholder="Pritish Jadon" onchange={(e) => {
                            setPostInputs({
                                ...postInputs, // all the existing keys
                                name: e.target.value // override the name with the new value
                            })
                    }} /> :  null }
                    <LabelledInput label="Username" placeholder="pritish2222@gmail.com" onchange={(e) => {
                            setPostInputs({
                                ...postInputs, // all the existing keys
                                username: e.target.value // override the name with the new value
                            })
                    }} />
                    <LabelledInput label="Password" placeholder="pritishxyz" type={"password"} onchange={(e) => {
                            setPostInputs({
                                ...postInputs, // all the existing keys
                                password: e.target.value // override the name with the new value
                            })
                    }} />
                    <button onClick={sendRequest} type="button" className="text-white mt-5 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 w-full font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signin" ? "Sign In" : "Sign Up"}</button>

                </div>
            </div>
        </div>
    </div>
}

interface LabelledInputType {
    label : string;
    placeholder : string;
    onchange : (e : ChangeEvent<HTMLInputElement>) => void;
    type? : string;
}
function LabelledInput({label, placeholder, onchange, type}: LabelledInputType) {
    return <div>
    <label  className="block mb-2 pt-5 text-sm font-semibold text-gray-900 dark:text-white">{label}</label>
    <input onChange={onchange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
</div>
}