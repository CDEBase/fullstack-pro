import * as React from "react";
import "./Button.css";

export interface IProps {
    btnName: string,
    onClick?: any
}
const Button: React.SFC<IProps> = props => {
    return(
        <div>

            <button type="submit" onClick={props.onClick}>
                {props.btnName}
            </button>
        </div>
    );

}

export default Button;