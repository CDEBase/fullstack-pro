import styled from '@emotion/styled';

interface ButtonStyles {
    bgColor?: string;
    color?: string;
    padding?: string;
    fontSize?: string;
    colorOnHover?: string;
    borderRadius?: string;
    children?: string;
    borderColor?: string;
    border?: string;
    marginLeft?: string;
    width?: string;
}

export const Button = styled.button<ButtonStyles>`
    padding: ${(props) => props.padding || '8px'};
    background-color: ${(props) => props.bgColor || '#fff'};
    font-size: ${(props) => props.fontSize || '13px'};
    border-radius: ${(props) => props.borderRadius || '0'};
    color: ${(props) => props.color};
    border-color: ${(props) => props.borderColor};
    border: ${(props) => props.border};
    margin-left: ${(props) => props.marginLeft || ''};
    width: ${(props) => props.width || ''};
    cursor: pointer;

    &:hover {
        background-color: ${(props) => props.colorOnHover || ''};
    }
`;
