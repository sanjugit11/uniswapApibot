import react,{useEffect,useState} from "react";
import "./InputFile.css";
import { Link } from "react-router-dom";
const InputFile = () => {

    const [data, setData] = useState( );
    const [disable, setDisable] = useState(false);
  
    const onChange = (event) => {
      setData(event.target.value)
    }

    const handleEnable = async () => {
        console.log({percent:+data});
        // fetch()
          const url = 'http://localhost:4000/enable';
          const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            percent:+data
          }),
          };
          fetch(url, options)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          });
          setDisable(true);
      }

    const handleDisable =()=>{
   
        const url = 'http://localhost:4000/disable';
        const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        } };
        fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
      
    } 

    return(
      <>
      
        <header className="App-header">
          <div className="back">
            <Link to="/">back </Link>
          </div>
          <div className="textArea">
           <h1> Manage Bot</h1>
           <h4>Enter value in the percentage</h4>
            <p>Note: The percentage value will the gap
               from market price and pool<br></br> price when bot will excute transaction</p>
          </div>
         <div className="clickArea">
        <input type="number"
          placeholder='Enter percent'
          value={data}
          onChange={(e) => onChange(e)}
        />
          <button
            onClick={() => !disable?handleEnable():(handleDisable(),setDisable(false))}
          >
            {!disable ?"Enable":"Disable"}
          </button>
          </div>
      </header>
      </>
    )
}

export default InputFile