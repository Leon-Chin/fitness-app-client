import React, { useState, useEffect } from 'react'
import './index.less'
import pngurl1 from '../../Pic/monitorProcess.webp'
import pngurl2 from '../../Pic/contact.webp'
import pngurl3 from '../../Pic/tutorial.webp'
import pngurl4 from '../../Pic/game.webp'
import pngurl5 from '../../Pic/workoutPlan.jpg'
import { useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux'
import { loginFailure, loginStart, loginSuccess } from '../../redux/userSlice'
import { auth, provider } from '../../firebase'
import { signInWithPopup } from 'firebase/auth'
import { message } from 'antd'
import { getuser, signin, signinWithGoogle, usersignup } from '../../api/user.api'
import { setContacts } from '../../redux/ContactsSlice'
export default function Login() {
    const { formatMessage } = useIntl()
    const [focusedname, setFocusedname] = useState(false)
    const [focusedpassword, setFocusedpassword] = useState(false)
    const [focusednameSup, setFocusednameSup] = useState(false)
    const [focusedpasswordSup, setFocusedpasswordSup] = useState(false)
    const [focusedemail, setFocusedemail] = useState(false)
    const [selectedPic, setSelectedPic] = useState(1)
    const [signup, setSignup] = useState(false)
    const [sigInInfo, setSignInInfo] = useState({})
    const [sigUpInfo, setSignUpInfo] = useState({})
    const activename = focusedname ? 'active' : ''
    const activepassword = focusedpassword ? 'active' : ''
    const activenameSup = focusednameSup ? 'active' : ''
    const activepasswordSup = focusedpasswordSup ? 'active' : ''
    const activeemail = focusedemail ? 'active' : ''
    const dispatch = useDispatch()
    const navigateTo = useNavigate()
    // 轮播图效果
    useEffect(() => {
        const timer = window.setInterval(() => {
            setSelectedPic((prev) => {
                return prev !== 5 ? prev + 1 : 1
            })
        }, 3000);
        return () => {
            clearInterval(timer);
        };
    }, []);
    const prepareContactsInfo = async (contacts) => {
        const contactsPromise = contacts.map(contactID => getuser(contactID));
        let contactUsers = await Promise.all(contactsPromise)
        let handledContacts = {}
        contactUsers.map(user => {
            handledContacts[user._id] = user
        })
        dispatch(setContacts(handledContacts))
    }
    const registerUser = async () => {
        dispatch(loginStart())
        await usersignup(sigUpInfo)
            .then((res) => {
                localStorage.setItem('token', res.token)
                dispatch(loginSuccess(res.user))
                const contacts = res.user.contactsUsers
                prepareContactsInfo(contacts)
                navigateTo('/')
                message.success('Register Successfully! Have a nice trip!!!')
            })
            .catch(() => {
                dispatch(loginFailure())
                message.error('Registration Failure! Try again please')
            })
    }

    const UserSignIn = async () => {
        await signin(sigInInfo)
            .then((res) => {
                localStorage.setItem('token', res.token)
                dispatch(loginSuccess(res.user))
                const contacts = res.user.contactsUsers
                prepareContactsInfo(contacts)
                navigateTo('/')
                message.success('Login Successfully! Welcome Back!!!')
            })
            .catch(() => {
                dispatch(loginFailure())
                message.error('Login Failure! Try again please')
            })
    }
    const SignInWithGoogle = async () => {
        dispatch(loginStart())
        signInWithPopup(auth, provider)
            .then(async (res) => {
                await signinWithGoogle({ name: res.user.displayName, email: res.user.email, avator: res.user.photoURL })
                    .then((res) => {
                        localStorage.setItem('token', res.token)
                        dispatch(loginSuccess(res.user))
                        const contacts = res.user.contactsUsers
                        prepareContactsInfo(contacts)
                        navigateTo('/')
                        message.success('Login Successfully! Welcome Back!!!')
                    })
            })
            .catch(() => {
                dispatch(loginFailure())
                message.error('Login with Google failure! Try again please')
            })
    }
    return (
        <main className={signup ? 'sign-up-mode' : ''}>
            <div className='box'>
                <div className='inner-box'>
                    <div className='forms-wrap'>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            UserSignIn()
                        }} autoComplete="off" className='sign-in-form'>
                            <div className='logo'>
                                {/* img */}
                                <h4>Target - FitnessApp</h4>
                            </div>
                            <div className='heading'>
                                <h2>{formatMessage({ id: 'app.login.welcomeback' })}</h2>
                                <h6>{formatMessage({ id: 'app.login.notRegisteredYet' })}</h6>
                                <a className='toggle' onClick={() => setSignup(true)}>&nbsp;{formatMessage({ id: 'app.login.signup' })}</a>
                            </div>
                            <div className='actual-form'>
                                <div className='input-wrap'>
                                    <input
                                        type='text'
                                        minLength={3}
                                        className={`input-field ${activename}`}
                                        onFocus={() => setFocusedname(true)}
                                        onBlur={({ target: { value } }) => {
                                            if (value != "") {
                                                return;
                                            }
                                            setFocusedname(false)
                                        }}
                                        onChange={({ target: { value } }) => setSignInInfo({ ...sigInInfo, name: value })}
                                        autoComplete="off"
                                        required
                                    />
                                    <label>{formatMessage({ id: 'app.login.name' })}</label>
                                </div>
                                <div className='input-wrap'>
                                    <input
                                        type='password'
                                        minLength={4}
                                        onFocus={() => setFocusedpassword(true)}
                                        onBlur={({ target: { value } }) => {
                                            if (value != "") {
                                                return;
                                            }
                                            setFocusedpassword(false)
                                        }}
                                        onChange={({ target: { value } }) => setSignInInfo({ ...sigInInfo, password: value })}
                                        className={`input-field ${activepassword}`}
                                        autoComplete="off"
                                        required
                                    />
                                    <label>{formatMessage({ id: 'app.login.password' })}</label>
                                </div>
                                <input type='submit' value={formatMessage({ id: 'app.login.signin' })} className='sign-btn' />
                                <input onClick={SignInWithGoogle} type='submit' value={formatMessage({ id: 'app.login.signinwithgoogle' })} className='sign-btn' />
                                <p className='text'>
                                    {formatMessage({ id: 'app.login.forgetPassword' })}
                                    <a>Get help</a> signing in
                                </p>
                            </div>
                        </form>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            registerUser()
                        }} autoComplete="off" className='sign-up-form'>
                            <div className='logo'>
                                {/* img */}
                                <h4>FitnessApp</h4>
                            </div>
                            <div className='heading'>
                                <h2>{formatMessage({ id: 'app.login.getStarted' })}</h2>
                                <h6>{formatMessage({ id: 'app.login.alreadyhaveacc' })}</h6>
                                <a className='toggle' onClick={() => setSignup(false)}>&nbsp;{formatMessage({ id: 'app.login.signin' })}</a>
                            </div>
                            <div className='actual-form'>
                                <div className='input-wrap'>
                                    <input
                                        type='text'
                                        minLength={4}
                                        className={`input-field ${activenameSup}`}
                                        onFocus={() => setFocusednameSup(true)}
                                        onBlur={({ target: { value } }) => {
                                            if (value != "") {
                                                return;
                                            }
                                            setFocusednameSup(false)
                                        }}
                                        onChange={({ target: { value } }) => setSignUpInfo({ ...sigUpInfo, name: value })}
                                        autoComplete="off"
                                        required
                                    />
                                    <label>{formatMessage({ id: 'app.login.name' })}</label>
                                </div>
                                <div className='input-wrap'>
                                    <input
                                        type='email'
                                        minLength={4}
                                        className={`input-field ${activeemail}`}
                                        onFocus={() => setFocusedemail(true)}
                                        onBlur={({ target: { value } }) => {
                                            if (value != "") {
                                                return;
                                            }
                                            setFocusedemail(false)
                                        }}
                                        onChange={({ target: { value } }) => setSignUpInfo({ ...sigUpInfo, email: value })}
                                        autoComplete="off"
                                        required
                                    />
                                    <label>{formatMessage({ id: 'app.login.email' })}</label>
                                </div>
                                <div className='input-wrap'>
                                    <input
                                        type='password'
                                        minLength={4}
                                        onFocus={() => setFocusedpasswordSup(true)}
                                        onBlur={({ target: { value } }) => {
                                            if (value != "") {
                                                return;
                                            }
                                            setFocusedpasswordSup(false)
                                        }}
                                        className={`input-field ${activepasswordSup}`}
                                        autoComplete="off"
                                        onChange={({ target: { value } }) => setSignUpInfo({ ...sigUpInfo, password: value })}
                                        required
                                    />
                                    <label>{formatMessage({ id: 'app.login.password' })}</label>
                                </div>
                                <input type='submit' value={formatMessage({ id: 'app.login.signup' })} className='sign-btn' />
                                <p className='text'>
                                    By signing up, I agree to the <a>Terms of Services</a> and <a style={{ cursor: 'pointer' }}>Privacy policy</a>
                                </p>
                            </div>
                        </form>
                    </div>
                    <div className='carousel'>
                        <div className='images-wrapper'>
                            <img src={pngurl1} className={`image img-1 ${selectedPic === 1 && "show"}`}></img>
                            <img src={pngurl2} className={`image img-2 ${selectedPic === 2 && "show"}`}></img>
                            <img src={pngurl3} className={`image img-3 ${selectedPic === 3 && "show"}`}></img>
                            <img src={pngurl4} className={`image img-4 ${selectedPic === 4 && "show"}`}></img>
                            <img src={pngurl5} className={`image img-5 ${selectedPic === 5 && "show"}`}></img>
                        </div>
                        <div className='text-slider'>
                            <div className='text-wrap'>
                                <div className='text-group' style={{ transform: `translateY(${-(selectedPic - 1) * 2.2}rem)` }}>
                                    <h2>{formatMessage({ id: 'app.login.propaganda1' })}</h2>
                                    <h2>{formatMessage({ id: 'app.login.propaganda2' })}</h2>
                                    <h2>{formatMessage({ id: 'app.login.propaganda3' })}</h2>
                                    <h2>{formatMessage({ id: 'app.login.propaganda4' })}</h2>
                                    <h2>{formatMessage({ id: 'app.login.propaganda5' })}</h2>
                                </div>
                            </div>
                            <div className='bullets'>
                                <span className={selectedPic === 1 ? `active` : ''} onClick={() => setSelectedPic(1)}></span>
                                <span className={selectedPic === 2 ? `active` : ''} onClick={() => setSelectedPic(2)}></span>
                                <span className={selectedPic === 3 ? `active` : ''} onClick={() => setSelectedPic(3)}></span>
                                <span className={selectedPic === 4 ? `active` : ''} onClick={() => setSelectedPic(4)}></span>
                                <span className={selectedPic === 5 ? `active` : ''} onClick={() => setSelectedPic(5)}></span>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </main >
    )
}
