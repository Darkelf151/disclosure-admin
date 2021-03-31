import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useHistory} from "react-router-dom";
import {Button} from "../../components/UI/Button";
import { updateBusiness, deleteBusiness } from '../../store/actions/business';
import './EditOffersScreen.css';

import Input from "../../components/UI/Input";

const EditOffersScreen = (props) => {
    let query = new URLSearchParams(useLocation().search);
    const id = query.get("id");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [newHero, setNewHero] = useState('');
    const [newBtmLeft, setNewBtmLeft] = useState('');
    const [newBtmRight, setNewBtmRight] = useState('');
    const [imageHeroUrl, setImageHeroUrl] = useState('');
    const [imageBtmLeftUrl, setImageBtmLeftUrl] = useState('');
    const [imageBtmRightUrl, setImageBtmRightUrl] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [categoryId, setCategoryId] = useState('');

    const dateObj = new Date();
    const d = dateObj.getDate();
    const m = dateObj.getMonth() + 1;
    const y = dateObj.getFullYear();
    const today = y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d)

    const user = useSelector(state => state.auth);
    const business = useSelector(state => state.business.selectedBusiness);
    const categories = useSelector(state => state.business.categories);
    const dispatch = useDispatch();
    const history = useHistory();

    const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
    const FORM_UPDATE_ALL = 'FORM_UPDATE_ALL';

    const formReducer = (state, action) => {
        if (action.type === FORM_INPUT_UPDATE) {
            const updatedValues = {
                ...state.inputValues,
                [action.input]: action.value
            };
            const updatedValidities = {
                ...state.inputValidities,
                [action.input]: action.isValid
            };
            let updatedFormIsValid = true;
            for (const key in updatedValidities) {
                updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
            }
            return {
                formIsValid: updatedFormIsValid,
                inputValidities: updatedValidities,
                inputValues: updatedValues
            };
        }
        if (action.type === FORM_UPDATE_ALL) {
            const updatedValues = {
                name: action.value.name,
                address: action.value.address,
                town: action.value.town,
                postcode: action.value.postcode,
                phone: action.value.phone,
                start: action.value.start,
                end: action.value.end,
                title: action.value.title,
                description: action.value.description,
                heroImageUrl: action.value.heroImageUrl,
                bottomImage1: action.value.bottomImage1,
                bottomImage2: action.value.bottomImage2,
                category: action.value.category
            }
            const updatedValidities = {
                name: true,
                address: true,
                town: true,
                postcode: true,
                phone: true,
                start: true,
                end: true,
                title: true,
                description: true,
                heroImageUrl: true,
                bottomImage1: true,
                bottomImage2: true,
                category: true,
            };
            const updatedFormIsValid = true;

            return {
                formIsValid: updatedFormIsValid,
                inputValidities: updatedValidities,
                inputValues: updatedValues
            };
        }
        return state;
    };

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            name: business ? business.name : '',
            address: business ? business.address : '',
            town: business ? business.town : '',
            postcode: business ? business.postcode : '',
            phone: business ? business.phone : '',
            start: business ? business.start : '',
            end: business ? business.end: '',
            title: business ? business.title : '',
            description: business ? business.description : '',
            heroImageUrl: business ? business.heroImageUrl : '',
            bottomImage1: business ? business.bottomImage1 : '',
            bottomImage2: business ? business.bottomImage2 : '',
            category: business ? business.category: '',
        },
        inputValidities: {
            name: !!business.name,
            address: !!business.address,
            town: !!business.town,
            postcode: !!business.postcode,
            phone: !!business.phone,
            start: !!business.start,
            end: !!business.end,
            title: !!business.title,
            description: !!business.description,
            heroImageUrl: !!business.heroImageUrl,
            bottomImage1: !!business.bottomImage1,
            bottomImage2: !!business.bottomImage2,
            category: !!business.category
        },
        formIsValid: false
    });

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        let action;
            action = updateBusiness(
                id,
                formState.inputValues.name,
                formState.inputValues.address,
                formState.inputValues.town,
                formState.inputValues.postcode,
                formState.inputValues.phone,
                formState.inputValues.start,
                formState.inputValues.end,
                formState.inputValues.title,
                formState.inputValues.description,
                formState.inputValues.heroImageUrl,
                formState.inputValues.bottomImage1,
                formState.inputValues.bottomImage2,
                newHero,
                newBtmLeft,
                newBtmRight,
                user.token,
                formState.inputValues.category
            );

        try {
            await dispatch(action).then(()=>{
                setIsLoading(false);
                history.push("/offers")
            });
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        },
        [dispatchFormState]
    );

    useEffect(() => {
        if (error) {
            //alert('An error occured', error, [{text: "Ok"}])
            console.log({error})
        }
    }, [error]);

    useEffect(()=>{

        if (id) {
            const setInitState = ()=>{
                setIsLoading(false);
                setImageHeroUrl(business.heroImageUrl);
                setImageBtmLeftUrl(business.bottomImage1);
                setImageBtmRightUrl(business.bottomImage2);
                setCategoryId(business.category);
                dispatchFormState({
                    type: FORM_UPDATE_ALL,
                    value: {
                        name: business.name,
                        address: business.address,
                        town: business.town,
                        postcode: business.postcode,
                        phone: business.phone,
                        start: business.start,
                        end: business.end,
                        title: business.title,
                        description: business.description,
                        heroImageUrl: business.heroImageUrl,
                        bottomImage1: business.bottomImage1,
                        bottomImage2: business.bottomImage2,
                        category: business.category
                    }
                });
            }

            setInitState();
        }

    }, [isLoading, business, id]);

    const imageUploadHandler = async (file, setState) => {
        const formData = new FormData();
        formData.append("fileUpload", file[0]);
            const response = await fetch("http://18.135.69.3/api/multiimageupload.php", {
                method: "POST",
                headers: {
                    'Accept': '*/*',
                    'Accept-Encoding':'gzip,deflate,br',
                    'Connection': 'keep-alive',
                },
                body: formData
            }).catch(console.error);
            const resData = await response.json();
            if (resData.status) {
                setState(resData.imagepath);
            }
    }


    const uploadHeroHandler = (event) => {

        let reader = new FileReader();
        let file = event.target.files;
        imageUploadHandler(file, setNewHero).then(response => (()=>{}));
        reader.onloadend = () => {
            setNewHero(file);
            setImageHeroUrl(reader.result)
        }
        reader.readAsDataURL(file[0]);

        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: event.target.value,
            isValid: true,
            input: 'heroImageUrl'
        });
    }
    const uploadBtmLeftHandler = (event) => {

        let reader = new FileReader();
        let file = event.target.files;
        imageUploadHandler(file, setNewBtmLeft).then(response => (()=>{}));
        reader.onloadend = () => {
            setNewBtmLeft(file[0]);
            setImageBtmLeftUrl(reader.result)
        }
        reader.readAsDataURL(file[0]);

        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: event.target.value,
            isValid: true,
            input: 'bottomImage1'
        });
    }
    const uploadBtmRightHandler = (event) => {

        let reader = new FileReader();
        let file = event.target.files;
        imageUploadHandler(file, setNewBtmRight).then(response => (()=>{}));

        reader.onloadend = () => {
            setNewBtmRight(file[0]);
            setImageBtmRightUrl(reader.result)
        }
        reader.readAsDataURL(file[0]);

        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: event.target.value,
            isValid: true,
            input: 'bottomImage2'
        });
    }

    useEffect(()=>{
        setShowForm(false);
        if(id === business.id) {setShowForm(true)}
        if(!id) {setShowForm(true)}
    },[id, business.id])

    const deleteHandler = () => {
        dispatch(deleteBusiness(id, user.token));
        history.push("/offers");
    }

    const selectChangeHandler = (e) => {
        setCategoryId(e.target.value);
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: e.target.value,
            isValid: true,
            input: 'category'
        });
    }

    return (
        <div className='editoffer__container'>
            {id ? (
                    <div className="editoffer__header">
                        <div>
                            <h1>Update Offer</h1>
                        </div>
                        <div className="editoffer__buttons">
                            <Button
                                buttonSize="btn--small"
                                buttonColor="green"
                                onClick={submitHandler}
                            >Update Offer</Button>
                            <Button
                                buttonSize="btn--small"
                                buttonColor="red"
                                onClick={deleteHandler}
                            >Delete Offer</Button>
                        </div>
                    </div>

            ) : (
                <div className="editoffer__header">
                    <h1>Create New Offer</h1>
                    <Button
                        buttonSize="btn--small"
                        buttonColor="green"
                        onClick={submitHandler}
                    >Create Offer</Button>
                </div>

            )}
            <form className="offerForm">
                {showForm &&
                <div className="editoffer__wrapper">
                    <div className="editoffer__formContainer">
                        <Input
                            id="name"
                            label="Name"
                            type="text"
                            required
                            autoCapitalize="none"
                            errorText="Please enter a name."
                            onInputChange={inputChangeHandler}
                            initialValue={business ? business.name:''}
                            initiallyValid={!!business}
                            updatedValue={business ? business.name:''}
                        />
                        <Input
                            id="address"
                            label="address"
                            type="text"
                            required
                            autoCapitalize="none"
                            errorText="Please enter a street address."
                            onInputChange={inputChangeHandler}
                            initialValue={business ? business.address:''}
                            initiallyValid={!!business}
                            updatedValue={business ? business.address:''}

                        />
                        <Input
                            id="town"
                            label="Town"
                            type="text"
                            required
                            autoCapitalize="none"
                            errorText="Please enter a town."
                            onInputChange={inputChangeHandler}
                            initialValue={business ? business.town:''}
                            initiallyValid={!!business}
                            updatedValue={business ? business.town:''}
                        />
                        <Input
                            id="postcode"
                            label="Postcode"
                            type="text"
                            postcode
                            required
                            autoCapitalize="all"
                            errorText="Please enter a valid postcode."
                            onInputChange={inputChangeHandler}
                            initialValue={business ? business.postcode:''}
                            initiallyValid={!!business}
                            updatedValue={business ? business.postcode:''}
                        />
                        <Input
                            id="phone"
                            label="Phone"
                            type="tel"
                            phone
                            required
                            autoCapitalize="none"
                            errorText="Please enter a valid phone number."
                            onInputChange={inputChangeHandler}
                            initialValue={business ? business.phone:''}
                            initiallyValid={!!business}
                            updatedValue={business ? business.phone:''}
                        />
                        <div className="spacer"></div>

                        <Input
                            id="start"
                            label="Offer start date"
                            type="date"
                            date
                            min={today}
                            required
                            autoCapitalize="none"
                            errorText="Please enter a start date."
                            onInputChange={inputChangeHandler}
                            initialValue={business ? business.start:''}
                            initiallyValid={!!business}
                            updatedValue={business ? business.start:''}
                        />
                        <Input
                            id="end"
                            label="Offer end date"
                            type="date"
                            date
                            min={today}
                            required
                            autoCapitalize="none"
                            errorText="Please enter a start date."
                            onInputChange={inputChangeHandler}
                            initialValue={business ? business.end:''}
                            initiallyValid={!!business}
                            updatedValue={business ? business.end:''}
                        />
                        <span className="inputlabel">Category</span>
                        <select
                            className="select-css"
                            value={categoryId}
                            onChange={selectChangeHandler}
                        >
                            {categories.map(category => (
                                <option value={category.id} key={category.id}>{category.username}</option>
                            ))}

                        </select>
                    </div>

                    <div className="editoffer__formContainer">
                        <Input
                            id="title"
                            label="Offer title"
                            type="text"
                            required
                            autoCapitalize="none"
                            errorText="Please enter a offer title."
                            onInputChange={inputChangeHandler}
                            initialValue={business ? business.title:''}
                            initiallyValid={!!business}
                            updatedValue={business ? business.title:''}
                        />
                        <Input
                            id="description"
                            label="Offer description"
                            type="text"
                            textarea
                            required
                            autoCapitalize="none"
                            errorText="Please enter a offer description."
                            onInputChange={inputChangeHandler}
                            initialValue={business ? business.description :''}
                            initiallyValid={!!business}
                            updatedValue={business ? business.description:''}
                        />
                        <div className="spacer"></div>
                        <div className="editoffer_upload_btn_wrapper">
                            <span className="editoffer__imageLabel">Change top image</span>
                            <input
                                id="main_image"
                                type="file"
                                onChange={uploadHeroHandler}
                            />
                        </div>

                        <div className="spacer"></div>
                        <div className="editoffer_upload_btn_wrapper">
                        <span className="editoffer__imageLabel">Change bottom left image</span>
                        <input
                            id="bottomImage1"
                            type="file"
                            onChange={uploadBtmLeftHandler}
                        />
                        </div>
                        <div className="spacer"></div>
                        <div className="editoffer_upload_btn_wrapper">
                        <span className="editoffer__imageLabel">Change bottom right image</span>
                        <input
                            id="bottomImage2"
                            type="file"
                            onChange={uploadBtmRightHandler}
                        />
                        </div>
                    </div>
                <div className="editoffer__preview">
                    <div>
                        <div className="editoffer__mobile_preview">
                            {business &&
                                <div className="editoffer">
                                    <div className="editoffer__logoContainer">
                                        {imageHeroUrl && <img className='editoffer_hero_image' src={imageHeroUrl} alt='header'/>}
                                    </div>
                                    <div className="editoffer_mainContainer">
                                        <div className="editoffer__titleWrapper">
                                            <div className="editoffer_titleContent">
                                                <h3>{formState.inputValues.name}</h3>
                                            </div>
                                            <div className="editoffer__town">
                                                {formState.inputValues.town}
                                            </div>
                                        </div>
                                        <div className="editoffer__titleContent">
                                            {formState.inputValues.title}
                                        </div>
                                        <div className="editoffer__description">
                                            {formState.inputValues.description}
                                        </div>
                                        <div className="editoffers__bottomImageContainer">
                                            <div className="editoffers__bottomImage">
                                                {imageBtmLeftUrl && <img className="bottomImage" src={imageBtmLeftUrl} alt="bottom1"/>}
                                            </div>
                                            <div className="editoffers__bottomImage">
                                                {imageBtmRightUrl && <img className="bottomImage" src={imageBtmRightUrl} alt="bottom2"/>}
                                            </div>
                                        </div>
                                        <div className="editoffers__addressContainer">
                                            <div className="editoffers__address">
                                                <span>{formState.inputValues.address}</span>
                                                <span>{formState.inputValues.town}</span>
                                                <span>{formState.inputValues.postcode}</span>
                                            </div>
                                            <div className="editoffers__address">
                                                <span>{formState.inputValues.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>}
            </form>
        </div>
    );
};

export default EditOffersScreen;
