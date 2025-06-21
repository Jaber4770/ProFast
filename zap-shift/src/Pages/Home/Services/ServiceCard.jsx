import { FaTruck, FaGlobeAsia, FaBoxes, FaMoneyBillWave, FaBuilding, FaUndo } from 'react-icons/fa';

const icons = [
    FaTruck,
    FaGlobeAsia,
    FaBoxes,
    FaMoneyBillWave,
    FaBuilding,
    FaUndo
];

const ServiceCard = ({ service, index }) => {
    const Icon = icons[index];

    return (
        <div className="card bg-base-100 border transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:text-white  hover:bg-[#cceb67c2]">
            <div className="card-body items-center text-center">
                <Icon className="text-4xl text-primary mb-4" />
                <h2 className="card-title">{service.title}</h2>
                <p>{service.description}</p>
            </div>
        </div>

    );
};

export default ServiceCard;
