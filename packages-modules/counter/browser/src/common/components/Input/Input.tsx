import * as React from "react";
import "./Input.css";

export interface IProps {
    labelName: string;
    value: string | number;
    type: "text" | "email" | "number" | "checkbox";
    placeholder?: string;
    onChange?: (e?: any) => void;
    name?: string;
}


const Input: React.SFC<IProps> = props => {
    return(
        <div>
            <label>
                {props.labelName}
                <input
                    type={props.type}
                    placeholder={props.placeholder}
                    onChange={props.onChange}
                    value={props.value}
                    name={props.name}
                />
            </label>
        </div>
    );
}

export default Input;