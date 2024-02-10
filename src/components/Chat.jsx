import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import Message from "./Message"

function Chat() {
  const inputPlaceholders = ["Feel free to start typing", "You can type here", "Write your message", "Your message goes here!", "May you pls start typing?", "Write something", "Bing chilling", "Start typing..."]
  const [message, setMessage] = useState("")
  const [user, setUser] = useState()
  const [messages, setMessages] = useState()
  const [msgError, setMsgError] = useState()
  const [meFadeAway, setMeFadeAway] = useState(false)
  const [poopStatus, setPoopStatus] = useState()
  const [randomPlaceholder, setRandomPlaceholder] = useState(inputPlaceholders[Math.floor(Math.random() * inputPlaceholders.length)])
  const oldestMessageTime = 172_800_000

  async function send() {
    if (message.length <= 400) {
      const { error } = await supabase
        .from('messages')
        .insert({
          sentBy: user.user_metadata.name,
          sentByEmail: user.email,
          pfpUrl: user.user_metadata.avatar_url,
          text: message,
          userid: user.id,
          timestamp: new Date().getTime()
        })
    } else {
      setMeFadeAway()
      setMsgError("Message is tooooo long.")
      setTimeout(() => {
        setMeFadeAway(true)
      }, 1800)
      setTimeout(() => {
        setMsgError("")
      }, 2000)
    }
  }

  async function getData() {
    const res = await supabase.from('messages').select("*").gt("timestamp", new Date().getTime() - oldestMessageTime)
    setMessages(res.data)
  }

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    createUserInDB(user)
  }

  const hanldePooped = (payload) => {
    console.log(payload)
    if (payload.new.userEmail === user.email) {
      setPoopStatus(payload.new)
    }
  }

  supabase.channel('users').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, hanldePooped).subscribe()

  async function createUserInDB(u) {
    const { data, error } = await supabase.from("users").select("*").eq("userEmail", u.email)
    if (data.length > 0) {
      // user in database already exists
      console.log("User already exists in the DB")
      setPoopStatus(data[0])
    } else {
      // user doesn't exist in the database
      const { error } = await supabase.from("users").insert({ lastGotPooped: null, lastPoopedSomeone: null, userEmail: u.email })
    }
  }

  const handleInserts = (payload) => {
    setMessages((prevMessages) => [...prevMessages, payload.new])
  }

  supabase.channel('messages').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, handleInserts).subscribe()

  async function deleteOldMessages() {
    const { error } = await supabase.from('messages').delete().lt("timestamp", new Date().getTime() - oldestMessageTime)
  }

  const checkEmptyMessage = msg => !msg.replace(/\s/g, '').length

  useEffect(() => {
    getData()
    getUser()
    deleteOldMessages()
  }, [])

  return (
    <>
      {poopStatus ? (
        <>
          {poopStatus.lastGotPooped > new Date().getTime() - 7_200_000 ? (
            <>
              <h1>You got pooped</h1>
            </>
          ) : (
            <>
              <>
                {msgError ? <p className="msg-error" style={meFadeAway ? { right: "-100vw" } : {}} >{msgError}</p> : ""}
                <div className="container">
                  <div id="chat" className="chat">
                    <div className="messages-wrp">
                      {messages ? (
                        <>
                          {messages.length > 0 ? (
                            <>
                              {poopStatus ? (
                                <>
                                  {messages.map(value => {
                                    return (
                                      <Message key={value.id} text={value.text} sentBy={value.sentBy} timestamp={value.timestamp} pfpUrl={value.pfpUrl} sentByEmail={value.sentByEmail} userLastPooped={poopStatus} />
                                    )
                                  })}
                                </>
                              ) : ""}
                            </>
                          ) : (
                            <div className="no-messages">
                              <p className="no-messages-text no-select">No messages were sent in the past 48 hours.</p>
                            </div>
                          )}
                        </>
                      ) : ""}
                    </div>
                    <div className="about-link-wrp">
                      <a href="/about" className="about-link">About PoopChat <span className="arrow">→</span></a>
                    </div>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      send()
                      setRandomPlaceholder(inputPlaceholders[Math.floor(Math.random() * inputPlaceholders.length)])
                      setMessage("")
                    }} className="chat-ctrls">
                      <div className={`input-wrp ${checkEmptyMessage(message) ? "input-wrp-cant-send" : "input-wrp-can-send"}`}>
                        <div className="input-pfp-btn">
                          <img className="input-pfp-img no-select" src={user ? user.user_metadata.avatar_url : ""} />
                        </div>
                        <input id="message-input" placeholder={randomPlaceholder} type="text" onChange={(e) => { setMessage(e.target.value) }} value={message} />
                      </div>
                      {checkEmptyMessage(message) ? "" : <input type="submit" value={"Submit"} />}
                    </form>
                  </div>
                </div>
              </>
            </>
          )}
        </>
      ) : ""}
    </>
  )
}

export default Chat