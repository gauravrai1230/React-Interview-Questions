import { useEffect, useRef, useState } from 'react'
import Pill from './components/Pill'

function App() {
  const [userInput, setUserInput] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [userArray, setUserArray] = useState([])
  const [userSet, setUserSet] = useState(new Set())
  const [activeSuggestion,setActiveSuggestion] = useState(0)

  const inputRef = useRef()
  const debounceTimer = useRef(null)

  const addUsertoList = (user) => {
    setUserArray([...userArray, user])
    setUserSet(new Set([...userSet, user.email]))
    setUserInput("")
    setSuggestions([])
    inputRef.current.focus()
  }
  

  const deleteUserfromList = (user) => {
    setUserArray(userArray.filter(item => item.email !== user.email))
    const updatedEmails = new Set(userSet)
    updatedEmails.delete(user.email)
    setUserSet(new Set(updatedEmails))
    inputRef.current.focus()
  }

  const handlekeydown = (e) => {
    if(e.key === "Backspace" && e.target.value === "" && userArray.length > 0){
      deleteUserfromList(userArray[userArray.length - 1])
      setSuggestions([])
    }
    else if(e.key === "ArrowDown" && suggestions?.users?.length > 0){
      e.preventDefault()
      setActiveSuggestion((prevIndex)=> prevIndex < suggestions.users.length -1 ? prevIndex + 1 : prevIndex)
      }

    else if(e.key === "ArrowUp" && suggestions?.users?.length > 0){
      e.preventDefault()
      if(activeSuggestion > 0){
        setActiveSuggestion(activeSuggestion - 1)
      }
    }
    else if(e.key === "Enter" && suggestions?.users?.length > 0){
      e.preventDefault()
      addUsertoList(suggestions.users[activeSuggestion])
    }
  }

  useEffect(()=>{
    try {
      function fetchData(){
        setActiveSuggestion(0)
        if(userInput.trim() === ""){ 
          setSuggestions([])
          return
        };

        // To clear the previous timer
        if(debounceTimer.current){
          clearTimeout(debounceTimer.current)
        }

        // Set a new timer of 600ms for debounce
        debounceTimer.current = setTimeout(()=>{

          fetch(`https://dummyjson.com/users/search?q=${userInput}`)
          .then(res => res.json())
          .then(data => setSuggestions(data))

        },600)
      }
      fetchData()
      
    } catch (error) {
     console.log(error) 
    }

    // Cleanup function for removing the timer on component unmounting
    return()=>{
      if(debounceTimer.current){
        clearTimeout(debounceTimer.current)
      }
    }
  },[userInput])

  return (
    <div className='w-full h-screen flex'>
      <div className='w-full p-4 bg-green-400'>
        <div className='border-2 rounded-xl p-1 flex flex-wrap items-center mb-1'>
          {userArray?.map((user)=>{
            return(
              <Pill key={user.email} img={user.image} name={user.firstName +" "+ user.lastName} onClick={()=> deleteUserfromList(user)} />
            )
          })}
          <input ref={inputRef} onKeyDown={handlekeydown} onChange={(e) => setUserInput(e.target.value)} className='p-2 grow border-none bg-green-400 text-white focus:outline-none' type="text" value={userInput} placeholder='Search for a user' />
        </div>
        <div className='overflow-y-scroll max-h-[300px]'>
          {suggestions?.users?.map((user,index)=>{
            if(userSet.has(user.email)) return;
            return(
              <div onClick={()=> addUsertoList(user)} key={user.email} className={"w-[300px] border-b-2 rounded-lg px-1 py-2 cursor-pointer bg-cyan-400 hover:bg-cyan-300 flex justify-start items-center" + (index === activeSuggestion ? " bg-cyan-300" : "")} >
                <img className='w-10 h-10 rounded-full' src={user.image} alt={user.firstName} />
                <span className='text-white text-xl ml-2'>{user.firstName + " " + user.lastName}</span>
              </div>
            )
          })}
        </div>
        
      </div>
    </div>
  )
}

export default App
