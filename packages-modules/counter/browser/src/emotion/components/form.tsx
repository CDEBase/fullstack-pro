import { css } from '@emotion/react';
import { Button } from './button';
import { styleSheet } from './styles';
const Form = ({ bgColor }) => {
    const formItems = [
        {
            type: 'text',
            placeholder: 'Full Name',
        },
        {
            type: 'email',
            placeholder: 'Email',
        },
        {
            type: 'password',
            placeholder: 'Password',
        },
    ];
    
    return (
        <div>
            <div css={styleSheet.fromWrapper}>
                <form>
                    {formItems.map((item, index) => {
                        return <input css={styleSheet.inputs} key={index} type="text" placeholder={item.placeholder} />;
                    })}
                </form>
                <Button
                    bgColor={bgColor}
                    color="#fff"
                    padding="15px 30px"
                    borderRadius="50px"
                    border="1px solid white"
                    width="100%"
                >
                    Get Started
                </Button>
            </div>
        </div>
    );
};

export default Form;
