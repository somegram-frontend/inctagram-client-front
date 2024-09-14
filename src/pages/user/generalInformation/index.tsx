import s from './generalinformation.module.scss'

const GeneralInformation = () => {
    return (
        <div className={s.wrapper}>
            <div className={s.uploadPhoto}>photo</div>
            <div className={s.fillProfile}>profile</div>
        </div>
    );
};

export default GeneralInformation;
