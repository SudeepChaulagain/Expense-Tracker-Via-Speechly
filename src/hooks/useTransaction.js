import { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'
import { incomeCategories, expenseCategories, resetCategories } from '../constants/categories'

const useTransaction = (title)=>{
    resetCategories()
    const {transactions} = useContext(GlobalContext)
    const transactionPerType = transactions.filter(t=>t.type === title)
    const total = transactionPerType.reduce((acc, currVal) => acc += currVal.amount, 0)
    const categories = title === 'Income' ? incomeCategories : expenseCategories
  
    transactionPerType.forEach((t) => {
      const category = categories.find((c) => c.type === t.category)
  
      if (category) category.amount += t.amount
    });
  
    const filteredCategories = categories.filter((sc) => sc.amount > 0)
  
    const chartData = {
      datasets: [{
        data: filteredCategories.map((c) => c.amount),
        backgroundColor: filteredCategories.map((c) => c.color),
      }],
      labels: filteredCategories.map((c) => c.type),
    };
  
    return {total, chartData }

}

export default useTransaction