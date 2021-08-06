import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import Modal from '../../components/Modal/Modal';
import { Container } from '../login/LoginStyles';
import { useAppSelector } from '../../hooks/reduxhooks';
import { currentLoggedUser } from '../../store/regSlice';
import Footer from '../../components/Footer';
import { ProfileInfo } from './AccountStyles';
import { BsPencilSquare } from 'react-icons/bs';
import { AiOutlineArrowDown, AiOutlineEnter, AiOutlineCheckCircle } from 'react-icons/ai';
import { Form } from '../login/LoginStyles';
import { Input } from '../../components/Input';

const Account: React.FC = () => {

    const userSelector = useAppSelector(currentLoggedUser);

    const [modal, setModal] = useState(false);
    const [changePass, setChangePass] = useState(false);
    const [newPass, setNewPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [editName, setEditName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);

    const editNameHandler = () => {
        return setEditName(!editName);
    };

    const editEmailHandler = () => {
        return setEditEmail(!editEmail);
    };

    const showModalHandler = () => {
        setModal(!modal);
    };

    const changePassHandler = () => {
        setChangePass(!changePass);
    }

    return (
        <>
            <Navbar />
            <Container padding="3rem 8.5rem" fd="column">
                <h3 id="profile">{userSelector.name.toUpperCase()}'S PROFILE:</h3>
                <ProfileInfo>
                    
                        <p><strong>Name:</strong> {userSelector.name}<BsPencilSquare onClick={editNameHandler} className="editIcon" /></p>
                    {editName && <div className="nameEdit">
                        <Input type="text" placeholder="Edit your name" />
                        <button className="confirmEdit"><AiOutlineCheckCircle /></button>
                    </div>}

                    
                        <p><strong>Email:</strong> {userSelector.email}<BsPencilSquare onClick={editEmailHandler} className="editIcon" /></p>
                    {editEmail && <div className="emailEdit">
                        <Input type="email" placeholder="Edit your email" />
                        <button className="confirmEdit"><AiOutlineCheckCircle /></button>
                    </div>}
                    
                    
                    <p id="changePassword" onClick={changePassHandler}><strong>Change password</strong> <AiOutlineArrowDown /></p>
                    {changePass && <Form className="changeForm">
                        <Input id="enter" type="password" onChange={() => setNewPass} placeholder="Enter your new password" />
                        <Input id="confirm" type="password" onChange={() => setConfirm} placeholder="Confirm your password" />
                        <button>Change</button>
                    </Form>}
                </ProfileInfo>
            </Container>
            <button onClick={showModalHandler}>Open Modal</button>
            {modal && <Modal onClose={showModalHandler}>
                <p>oi</p>
                <button onClick={showModalHandler}>close</button>
            </Modal>}
            <Footer />
        </>
    )
};

export default Account;