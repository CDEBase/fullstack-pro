import { css } from '@emotion/react';
import { Button } from './button';

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
    const fromWrapper = css({
        backgroundColor: 'white',
        width: '67.5%',
        margin: 'auto',
        padding: '40px',
        borderRadius: '15px',
    });
    const inputs = css({
        width: '100%',
        marginBottom: '20px',
        padding: '15px',
        borderRadius: '10px',
    });
    return (
        <div>
            <div css={fromWrapper}>
                <form>
                    {formItems.map((item, index) => {
                        return <input css={inputs} key={index} type="text" placeholder={item.placeholder} />;
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
