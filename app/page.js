
import Link from "next/link";
import { validateEmail, validatePassword } from "../lib/validation";
export default function Home(){
    return(
      <main className="page">
          <form className="form"> 
            <h1>Master Of Tickets </h1>
            <p> Book concerts, festivals and stadium events.</p>

              <h1> Sign In</h1>

              <label>Email</label>
              <input type="email" placeholder="Enter your email" />

              <label>Password</label>
              <input type="password" placeholder="Enter your Password" />

         

              {/* Sign in button */}
              <Link href ="/signin">
                <button>Sign In </button>
              </Link>

              <div>
                <p>
                  Don't have an account ? {" "}
                  <Link href ="/signup" >
                    Sign Up
                  </Link>
                </p>
              </div>
          </form>
      </main>
    )
}