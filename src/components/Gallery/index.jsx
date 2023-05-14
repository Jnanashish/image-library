// component to list all the images
import React, { useState } from "react";
import styles from "./gallery.module.css";
import Modal from "react-modal";

// custom style for modal
const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        padding: "10px",
    },
};

function Gallery({ data }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    // opne modal when click on a image
    const handleImageClick = (photo) => {
        setSelectedPhoto(photo);
        setModalIsOpen(true);
    };

    // on close button click close the modal and clear selected photo
    const closeModal = () => {
        setSelectedPhoto(null);
        setModalIsOpen(false);
    };

    const handleImageLoad = () => {
        console.log("IMAGE LOADED");
    };
    return (
        <div>
            {/* opne modal to show the enlarged image   */}
            <Modal style={customStyles} isOpen={modalIsOpen}>
                <div onClick={() => closeModal()}>
                    <span className={styles.close_button}>X</span>
                </div>
                {selectedPhoto && (
                    <img
                        src={`https://live.staticflickr.com/${selectedPhoto.server}/${selectedPhoto.id}_${selectedPhoto.secret}_w.jpg`}
                        alt={selectedPhoto.title}
                    />
                )}
            </Modal>
            <div className={styles.img_container}>
                {data &&
                    data.map((photo) => {
                        return (
                            <div key={photo.id}>
                                <img
                                    onLoad={handleImageLoad}
                                    onClick={() => handleImageClick(photo)}
                                    className={styles.image}
                                    src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_n.jpg`}
                                    alt={photo.title}
                                />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default Gallery;
