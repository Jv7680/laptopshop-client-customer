import { makeStyles } from "@mui/styles";
import { useEffect } from "react";

// declare var google;

export default function GoogleButton() {
    const classes = useStyles();

    useEffect(() => {
        window.google.accounts.id.renderButton(
            document.getElementById("btn-login-google"),
            { theme: "outline", size: "large" }  // customization attributes
        );
    }, []);

    return (
        <>
            <div className={classes.btnGoogle} id="btn-login-google" onClick={() => { window.google.accounts.id.prompt() }}></div>
            <div className={"btnLoginGoole " + classes.root} onClick={(event) => { }}>
                {/* <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="LgbsSe-Bz112c"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg> */}
                <i className="fa-brands fa-google-plus-g" style={{ color: "#ffffff" }}></i>
                <span>Đăng nhập với Google</span>
            </div>
        </>
    )
}

const useStyles = makeStyles({
    root: {
        position: "relative",
        height: 36,
        backgroundColor: "#CF4332",
        padding: "0 26px 0 38px",
        borderRadius: 4,
        color: "#FFFFFF",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: "none",
        cursor: "pointer",
        fontWeight: 400,
        transition: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

        "&:hover": {
            boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px',
        },

        "& i": {
            position: "absolute",
            top: "50%",
            left: 8,
            transform: "translateY(-50%)",
            fontSize: 22,
        }
    },
    btnGoogle: {
        position: "absolute",
        zIndex: 4,
        height: 36,
        opacity: 0.0000000001,
        bottom: 16,
        left: 14,
        overflow: "hidden",

        "&:hover + .btnLoginGoole": {
            boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px',
        }
    },
});


