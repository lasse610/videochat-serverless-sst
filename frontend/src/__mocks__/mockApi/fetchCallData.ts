

const fetchCallData = (id:string) => {

    const call = {
        id:'skjdajdlskajsldlad',
        callerName: "Lasse",
        created: "28/11/2021",
        expertName: 'Jaakko Parkkali',
        expertCompany: 'Wirmax'

    }

    const calls = [call]

    const res = calls.filter( c => c.id === id)
    return res

} 

export default fetchCallData;