
import styles from '../styles/Layout.module.css';


export default function Layout( { children }){
    return (
        <div className="flex p-5 bg-blue-400">
            <div className="m-auto bg-slate-50 rounded-md w-3/5 h-3/4 grid lg:grid-cols-2">
                <div className={styles.imgStyle}>
                    <div className={styles.cartoonImg}></div>
                    <div className={styles.cloud_one}></div>
                    <div className={styles.cloud_two}></div>
                </div>
                <div className="right flex flex-col justify-evenly">
                    <div className="text-center p-5">
                        {children}
                    </div>
                </div>
            </div>
  
        </div>
    )
}