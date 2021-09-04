import React,  { useContext, useState, useEffect } from 'react'
import { FormControl, Typography, Grid, Button, TextField, Select, MenuItem, InputLabel } from '@material-ui/core'
import { GlobalContext } from '../../../context/GlobalState'
import {v4 as uuidv4} from 'uuid'
import { incomeCategories, expenseCategories } from '../../../constants/categories'
import {formatDate} from '../../../utils/formatDate'
import { useSpeechContext } from '@speechly/react-client'
import CustomizedSnackbar from '../../Snackbar/Snackbar'
import useStyles from './style'

export const Form = () => {
    const classes = useStyles()

    const initialState = {
      amount:'',
      category:'',
      type:'Income',
      date: formatDate(new Date())
  }
    const {segment} = useSpeechContext()
    const [formData, setFormData] = useState(initialState)
    const [open, setOpen] = useState(false)
    const {addTransaction} = useContext(GlobalContext)
    const createTransaction = ()=>{
        if (Number.isNaN(Number(formData.amount) || !formData.date.includes('-'))) return 

        if (incomeCategories.map((iC) => iC.type).includes(formData.category)) {
          setFormData({ ...formData, type: 'Income' });
        } else if (expenseCategories.map((iC) => iC.type).includes(formData.category)) {
          setFormData({ ...formData, type: 'Expense' });
        }
        setOpen(true)
        addTransaction( {...formData, amount:Number(formData.amount), id:uuidv4()})
        setFormData(initialState)
    }

    const selectedCategories = formData.type === "Income" ? incomeCategories : expenseCategories

    useEffect(() => {
        if (segment) {
          if (segment.intent.intent === 'add_expense') {
            setFormData({ ...formData, type: 'Expense' })
          } else if (segment.intent.intent === 'add_income') {
            setFormData({ ...formData, type: 'Income' });
          } else if (segment.isFinal && segment.intent.intent === 'create_transaction') {
            return createTransaction()
          } else if (segment.isFinal && segment.intent.intent === 'cancel_transaction') {
            return setFormData(initialState)
          }
    
          segment.entities.forEach((s) => {
            const category = `${s.value.charAt(0)}${s.value.slice(1).toLowerCase()}`;
    
            switch (s.type) {
              case 'amount':
                setFormData({ ...formData, amount: s.value })
                break;

              case 'category':
                if (incomeCategories.map((iC) => iC.type).includes(category)) {
                  setFormData({ ...formData, type: 'Income', category })
                } else if (expenseCategories.map((iC) => iC.type).includes(category)) {
                  setFormData({ ...formData, type: 'Expense', category })
                }
                break;

              case 'date':
                setFormData({ ...formData, date: s.value });
                break;

              default:
                break;
            }
          });
    
          if (segment.isFinal && formData.amount && formData.category && formData.type && formData.date) {
            createTransaction()
          }
        }
      }, [segment]);
    return (
            <Grid container spacing={2}>
                <CustomizedSnackbar open={open} setOpen={setOpen}/>
                <Grid item xs={12}>
                <Typography align="center" variant="subtitle2" gutterBottom>
                    {segment && segment.words.map((w)=>w.value).join(" ")}
                </Typography>
                </Grid>

                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select value={formData.type} onChange={(e)=>setFormData({...formData, type:e.target.value})}>
                            <MenuItem value="Income">Income</MenuItem>
                            <MenuItem value="Expense">Expense</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select value={formData.category} onChange={(e)=>setFormData({...formData, category:e.target.value})}>
                          {selectedCategories.map(c=><MenuItem key={c.type} value={c.type}>{c.type}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <TextField type="number" label="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} fullWidth />
                </Grid>

                <Grid item xs={6}>
                    <TextField fullWidth label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: formatDate(e.target.value) })} />
                </Grid>
               <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={createTransaction}>Create</Button>

            </Grid>
    )
}
export default Form
