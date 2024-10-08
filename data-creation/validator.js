

module.exports = {
    check_required_fields: (fields, requiredFields) => {
        for (let i = 0; i < requiredFields.length; i++) {
            if (!fields[requiredFields[i]]) {
                return { status: false, key: i };
            }
        }
        return { status: true };
    },
    
    thumbnailValidator: (file, key) => {
        if (!file || !file.originalFilename) {
            return { status: false, key: key };
        }

        const validThumbnailExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const extension = file.originalFilename.split('.').pop().toLowerCase();
        if (!validThumbnailExtensions.includes(extension)) {
            return { status: false, key: key };
        }
        return { status: true };
    }
    ,
    idProofValidator: (file, key) => {
        if (!file || !file.originalFilename) {
            return { status: false, key: key };
        }
    
        const validIdProofExtensions = ['pdf'];
        const extension = file.originalFilename.split('.').pop().toLowerCase();
        if (!validIdProofExtensions.includes(extension)) {
            return { status: false, key: key };
        }
        return { status: true };
    },
     isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    ,
    
    
};



















    // svgImageValidator: (file) => {
    //     console.log(file);
    //     if (!file || !file.originalFilename) {
    //         throw new Error('File or filename is undefined');
    //     }
    
    //     const validImageExtensions = ['svg'];
    //     const extension = file.originalFilename.split('.').pop().toLowerCase();
    //     if (!validImageExtensions.includes(extension)) {
    //         throw new Error('Only svg image files are allowed');
    //     }
    // },
    

// videoValidator: (file) => {
//     console.log(file);
//     if (!file || !file.originalFilename) {
//         throw new Error('File or filename is undefined');
//     }

//     const validVideoExtensions = ['mp4', 'avi', 'mov', 'flv', 'wmv'];
//     const extension = file.originalFilename.split('.').pop().toLowerCase();
//     if (!validVideoExtensions.includes(extension)) {
//         throw new Error('Only mp4, avi, mov, flv, and wmv video files are allowed');
//     }
// },

// idtest: (file) => {
//     console.log(file);
//     if (!file || !file.originalFilename) {
//         throw new Error('File or filename is undefined');
//     }

//     const validThumbnailExtensions = ['jpg', 'jpeg', 'png', 'gif'];
//     const extension = file.originalFilename.split('.').pop().toLowerCase();
//     if (!validThumbnailExtensions.includes(extension)) {
//         throw new Error('Only jpg, jpeg, png, and gif image files are allowed');
//     }
// },

    // imageValidator: (file) => {
    //     console.log(file);
    //     if (!file || !file.originalFilename) {
    //         throw new Error('File or filename is undefined');
    //     }

    //     const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    //     const extension = file.originalFilename.split('.').pop().toLowerCase();
    //     if (!validImageExtensions.includes(extension)) {
    //         throw new Error('Only jpg, jpeg, png,svg,SVG and gif image files are allowed');
    //     }
    // },
 // check_required_fields: (fields, requiredFields) => {
    //     let errors = [];
        
    //     for (let i = 0; i < requiredFields.length; i++) {
    //         let field = requiredFields[i];
            
    //         if (!fields[field]) {
    //             errors.push(`${field} is required`);
    //         }
    //     }

    //     if(errors.length > 0){
    //         throw new Error(errors.join(', '));
    //     }
    // }