import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {getClients} from "../../store/actions/clients";
import './ClientsScreen.css';

function useAsyncRef(initialState) {
    const start = useRef(initialState);
    const [,forceRender] = useState(false);

    function updateStart(newState) {
        start.current = newState;
        forceRender(s=>!s);
    }
    return [start, updateStart];
}

const ClientsScreen = () => {

    const [error, setError] = useState(false);
    const [, setIsLoading] = useState(false);

    const user = useSelector(state => state.auth);
    const clients = useSelector(state =>  state.clients.clients);
    const numberClients = useSelector(state => state.clients.count);
    const [ind, setInd] = useAsyncRef([]);
    const dispatch = useDispatch();


    const searchHandler = useCallback(async () => {

        try {
            await dispatch(getClients(
                user.token
            ));
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }

    },[dispatch, user.token]);

    useEffect(()=>{
        searchHandler();
    },[searchHandler])

    useEffect(() => {
        if (error) {
            //alert('An error occured', error, [{text: "Ok"}])
            console.log({error})
        }
    }, [error]);

    const clientHandler = (email) => {
        let filteredClients = clients.filter(filter => filter.email === email);
        const startDate = (new Date (filteredClients[0].start)).toDateString();
        const newArray = {
            ...filteredClients[0],
            "start" : startDate
        }
        setInd(newArray);
    }


    return (
        <div className="client__screen">
            <div className="client__newClientContainer">
                <div className="client__header">
                    <p>Newest Clients</p>
                </div>
                <div className="client__listContainer">
                    {clients.map((client) => (
                    <div className="client__titleContainer"  onClick={() => {clientHandler(client.email)}} key={client.email}>
                        <div className="client__name">
                            <div className="client__listItem" key={client.key}>
                                <p>{client.fname} {client.lname}</p>
                            </div>
                        </div>


                    </div>
                    ))}
                </div>
            </div>
            <div className="client__newClientContainer">
                <div className="client__header">
                    <p>
                        Selected Client
                    </p>
                </div>
                <div className="client__body">
                    <div>
                        <div className="client__label">First Name</div>
                        <div className="client__inputStyle">{ind.current && ind.current.fname}</div>
                    </div>
                    <div>
                        <div className="client__label">Last Name</div>
                        <div className="client__inputStyle">{ind.current && ind.current.lname}</div>
                    </div>
                    <div>
                        <div className="client__label">Email</div>
                        <div className="client__inputStyle">{ind.current && ind.current.email}</div>
                    </div>
                    <div>
                        <div className="client__label">Sign up date</div>
                        <div className="client__inputStyle">{ind.current && ind.current.start}</div>
                    </div>
                    <div>
                        <div className="client__label">Mailing list</div>

                        <div className="client__inputStyle client__bottom">
                            {ind.current.fname && ind.current.mailingList && "Subscribed"}
                            {ind.current.fname && !ind.current.mailingList && "Not subscribed"}
                        </div>

                    </div>


                </div>
            </div>
            <div className="client__newClientContainer">
                <div className="client__header">
                </div>
                <div className="client__numbers">
                    Number of clients currently registered..
                </div>
                <div className="client__totalNumber">
                    {numberClients}
                </div>
            </div>
        </div>
    );
};

export default ClientsScreen;
