// import { useNavigate } from "react-router-dom";
import { useHistory } from "react-router-dom";

// use this function to navigate outside a react component
export let customizedNavigate;

export default function GlobalHistory() {
    customizedNavigate = useHistory().push;
    return null;
};