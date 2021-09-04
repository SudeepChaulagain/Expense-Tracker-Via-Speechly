import React, { createContext, useReducer } from "react"
import AppReducer from "./AppReducer"

const initialState = JSON.parse(localStorage.getItem('transactions')) || [{"amount":200,"category":"Business","type":"Income","date":"2021-09-06","id":"959701ae-99b1-413d-a6d7-8c75fbe9ff52"},{"amount":60,"category":"Food","type":"Expense","date":"2021-09-06","id":"9226f52c-fe76-4c8d-b7a1-099db9f1a454"},{"amount":40,"category":"Bills","type":"Expense","date":"2021-09-06","id":"e296f4d7-b558-4173-ab2f-2c469ed227fe"},{"amount":200,"category":"Salary","type":"Income","date":"2021-09-06","id":"5918ec07-dda5-4a87-bbe7-6b0801e567e9"}]

//create context
export const GlobalContext = createContext(initialState)

//Provider component
export const GlobalProvider = (props)=>{
    const [state, dispatch] = useReducer(AppReducer, initialState)

    const addTransaction = (transaction)=>{
        dispatch({type:'ADD_TRANSACTION', payload:transaction})
    }

    const deleteTransaction = (id)=>{
        dispatch({type:'DELETE_TRANSACTION', payload:id})
    }
    
    const balance = state.reduce((acc, currVal) => (currVal.type === 'Expense' ? acc - currVal.amount : acc + currVal.amount), 0)
    return (
        <GlobalContext.Provider value={{
            addTransaction,
            deleteTransaction,
            transactions: state,
            balance

        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}