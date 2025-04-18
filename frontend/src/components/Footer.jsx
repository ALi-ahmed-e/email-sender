import React from 'react'

const Footer = () => {
    return (


        <footer className="bg-white rounded-lg shadow-sm m-4 dark:bg-gray-800">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">developed by <a href="https://www.facebook.com/profile.php?id=100010796496004" className="hover:underline">ALI AHMED</a> in {Date().slice(11,15)} <a href="https://www.facebook.com/IEEE.ElShoroukAcademy.SB/?fref=ts" className="hover:underline">IEEE El Shorouk Academy</a></span>
                
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="https://github.com/ALi-ahmed-e" className="hover:underline me-4 md:me-6">github</a>
                    </li>
                    <li>
                        <a href="https://www.facebook.com/profile.php?id=100010796496004" className="hover:underline me-4 md:me-6">facebook</a>
                    </li>
                    <li>
                        <a href="https://www.linkedin.com/in/ali-ahmed-3621a8247/" className="hover:underline me-4 md:me-6">linkedin</a>
                    </li>
                    <li>
                        <a href="https://animated-rugelach-7f280d.netlify.app/" className="hover:underline">Contact</a>
                    </li>
                </ul>
            </div>
        </footer>


    )
}

export default Footer