import "./globals.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

export const metadata = {
    title: "Placeholder Name",
    description: "Babushka",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Navbar />

                <main className="container">
                    {children}
                </main>

                <Footer />
            </body>
        </html>
    );
}