// 'use strict';
// const MultipleFile = require('../models/multiplefile.module');
// const category = require("../models/category.module");

// const fileSizeFormatter = (bytes, decimal) => {
//     if (bytes === 0) {
//         return '0 Bytes';
//     }
//     const dm = decimal || 2;
//     const sizes = ['Bytes', 'KB', 'MB'];
//     const index = Math.floor(Math.log(bytes) / Math.log(1000));
//     return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

// }

// exports.createCategory = (req, res) => {
//     const filesPath = [];
//     const filesArray = [];
//     req.files.forEach(element => {
//         const file = {
//             fileName: element.originalname,
//             filePath: element.path,
//             fileType: element.mimetype,
//             fileSize: fileSizeFormatter(element.size, 2)
//         }
//         filesArray.push(file);
//         filesPath.push(element.path);
//     });
//     const multipleFiles = new MultipleFile({
//         files: filesArray
//     });
//     multipleFiles.save();
//     category.findOne({ name: req.body.name,arName: req.body.arName }, (err, categoryAlreadyExisted) => {
//         if (err) { res.status(200).send(err) };
//         if (categoryAlreadyExisted) {
//             res.status(403).json({ error: "This Category is already existed" });
//         } else {
//             const newCategory = category({
//                 name: req.body.name,
//                 arName: req.body.arName,
//                 subCategories: req.body.subCategories,
//                 arSubCategories: req.body.arSubCategories,
//                 image: filesPath
//             })
//             newCategory.save().then((savedCat) => {
//                 res.status(200).send(savedCat)
//             }).catch((err => {
//                 res.status(401).send(err)
//             }))
//         }
//     })
//     // const newCategory = category({
//     //     image: filesPath,
//     //     translation: req.body.translation
//     // })
//     // newCategory.save().then((savedCat) => {
//     //         res.status(200).send(savedCat)
//     //     }).catch((err => {
//     //         res.status(401).send(err)
//     // }))
// }

// //Update Category
// exports.updateCategory = (req, res) => {
//     category.findByIdAndUpdate(req.params.id, {
//             $set: req.body,
//         }, { new: true })
//         .then(cat => {
//             res.status(200).send(cat)
//         })
// }

// //Delete Category
// exports.deleteCategory = async(req, res) => {
//     try {
//         await category.findByIdAndDelete(req.params.id);
//         res.status(200).json("Category has been deleted Successfully .");
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };


// //GET ALL categories
// exports.getAllCategory = (req, res) => {
//     console.log(req.headers.lang);
//     if(req.headers.lang == 'ar') {
//         category.find({}, {
//             name: 0,
//             subCategories:0,
//             _id: 0
//         }).then(document => {
//             res.status(200).send(document);
//         }).catch(err => {
//             res.status(401).send([err, {
//                 message: "wrong something is wrong "
//             }])
//         })
//     }else{
//         category.find({}, {
//             arName: 0,
//             arSubCategories:0,
//             _id: 0
//         }).then(document => {
//             res.status(200).send(document);
//         }).catch(err => {
//             res.status(401).send([err, {
//                 message: "wrong something is wrong "
//             }])
//         })
//     }
// }


// //GET SUBCATEGORIES OF SPECIEFIC CATEGORY
// exports.getSubCategories = async(req, res) => {
//     const CategoryName = req.params.categoryName;
//     if (CategoryName) {
//         if(req.headers.lang == 'ar') {
//             category.find({
//                     arName: req.params.categoryName
//                 }, { arSubCategories: 1, _id: 0 })
//                 .then(document => {
//                     res.status(201).json(document);;
//                 })
//                 .catch(err => {
//                     res.status(500).json([err, {
//                         message: "something is wrong ...."
//                     }]);
//                 })
//         }else{
//             category.find({
//                 name: req.params.categoryName
//             }, { subCategories: 1, _id: 0 })
//             .then(document => {
//                 res.status(201).json(document);;
//             })
//             .catch(err => {
//                 res.status(500).json([err, {
//                     message: "something is wrong ...."
//                 }]);
//             })
//         }
//     } else {
//         res.status(500).json([err, {
//             message: "that not found ..."
//         }]);
//     }
// }

// //GET CATEGORY BY Name
// exports.getCategoryByName = (req, res) => {
//     if(req.headers.lang == 'ar' || req.headers.lang == 'en') {
//         category.findOne({$or:[{ name: req.params.categoryName  },{ arName: req.params.categoryName  }]}).then(category => {
//             res.status(200).send(category);
//         }).catch(err => {
//             res.status(401).send([err, {
//                 message: "something is wrong"
//             }])
//         })
//     }
// }
/////////////////////////////////////////////////////////
'use strict';
const MultipleFile = require('../models/multiplefile.module');
const category = require("../models/category.module");
const SingleFile = require('../models/singlefile.module');


const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

}

exports.createCategory = (req, res) => {
    const filesPath = [];
    const filesArray = [];
    req.files.forEach(element => {
        const file = {
            fileName: element.originalname,
            filePath: element.path,
            fileType: element.mimetype,
            fileSize: fileSizeFormatter(element.size, 2)
        }
        filesArray.push(file);
        filesPath.push(element.path);
    });
    const multipleFiles = new MultipleFile({
        files: filesArray
    });
    multipleFiles.save();
    category.findOne({ name: req.body.name, arName: req.body.arName }, (err, categoryAlreadyExisted) => {
        if (err) { res.status(200).send(err) };
        if (categoryAlreadyExisted) {
            res.status(403).json({ error: "This Category is already existed" });
        } else {
            const newCategory = category({
                name: req.body.name,
                arName: req.body.arName,
                subCategories: req.body.subCategories,
                arSubCategories: req.body.arSubCategoriesar,
                image: filesPath
            })
            newCategory.save().then((savedCat) => {
                res.status(200).send(savedCat)
            }).catch((err => {
                res.status(401).send(err)
            }))
        }
    })
    
}

exports.createCategoryByAdmin = (req, res) => {
    const filesPath = [];
    const filesArray = [];
    req.files.forEach(element => {
        const file = {
            fileName: element.originalname,
            filePath: element.path,
            fileType: element.mimetype,
            fileSize: fileSizeFormatter(element.size, 2)
        }
        filesArray.push(file);
        filesPath.push(element.path);
    });
    const multipleFiles = new MultipleFile({
        files: filesArray
    });
    multipleFiles.save();
   
    
    category.findOne({ name: req.body.name }, (err, categoryAlreadyExisted) => {
        if (err) { res.status(200).send(err) };
        if (categoryAlreadyExisted) {
            res.status(403).json({ error: "This Category is already existed" });
        } else {
            if (!req.body.parent) {
                console.log("fudsafkadsfklads");
                const newCategory = category({
                    name: req.body.name,
                    arName: req.body.arName,
                    image: filesPath
                })
                newCategory.save().then((savedCat) => {
                    res.status(200).send(savedCat)
                }).catch((err => {
                    res.status(401).send(err)
                }))
            } else {
                category.findOneAndUpdate({ name: req.body.parent }
                    , {
                        "$push": {
                            subCategories: {
                                name: req.body.name,
                                image: filesPath,
                                arName: req.body.arName,
                            },
                         
                        }
                    }, (err, category) => {
                        if (err) {
                            res.status(402).send([err, {
                                message: "somthing wrong..2.."
                            }])
                        };
                        if (category) {
                            res.status(201).send(category)
                        }
                    });
            }
        }
    })

}

//Delete Category
exports.deleteCategory = async (req, res) => {
    try {

        await category.findOneAndDelete({ name: req.params.name });
        res.status(200).json("Category has been deleted Successfully .");
        console.log("delete");

    } catch (err) {
        res.status(500).json(err); console.log("delete546");
    }
};


//GET ALL categories
exports.getAllCategory = (req, res) => {
    console.log(req.headers.lang);
    if (req.headers.lang == 'ar') {
        category.find({}, {
            name: 0,
            subCategories: 0,
            _id: 0
        }).then(document => {
            res.status(200).send(document);
        }).catch(err => {
            res.status(401).send([err, {
                message: "wrong something is wrong "
            }])
        })
    } else {
        category.find({}, {
            arName: 0,
            arSubCategories: 0,
            _id: 0
        }).then(document => {
            res.status(200).send(document);
        }).catch(err => {
            res.status(401).send([err, {
                message: "wrong something is wrong "
            }])
        })
    }
}


//GET SUBCATEGORIES OF SPECIEFIC CATEGORY
exports.getSubCategories = async (req, res) => {
    const CategoryName = req.params.categoryName;
    if (CategoryName) {
        if (req.headers.lang == 'ar') {
            category.find({
                arName: req.params.categoryName
            }, { arSubCategories: 1, _id: 0 })
                .then(document => {
                    res.status(201).json(document);;
                })
                .catch(err => {
                    res.status(500).json([err, {
                        message: "something is wrong ..."
                    }]);
                })
        } else {
            category.find({
                name: req.params.categoryName
            }, { subCategories: 1, _id: 0 })
                .then(document => {
                    res.status(201).json(document);;
                })
                .catch(err => {
                    res.status(500).json([err, {
                        message: "something is wrong ...."
                    }]);
                })
        }
    } else {
        res.status(500).json([err, {
            message: "that not found ..."
        }]);
    }
}

// GET CATEGORY BY Name
exports.getCategoryByName = (req, res) => {
    console.log(req.params)
    // if (req.headers.lang == 'ar' || req.headers.lang == 'en') {
        category.findOne({ $or: [{ name: req.params.categoryName }, { arName: req.params.categoryName }] }).then(category => {
            console.log(category)
            res.status(200).send(category);
        }).catch(err => {
            res.status(401).send([err, {
                message: "something is wrong"
            }])
        })
    // }else{
    //     category.findOne({ name: req.params.categoryName }).then(category => {
    //         console.log(category)
    //         res.status(200).send(category);
    //     }).catch(err => {
    //         res.status(401).send([err, {
    //             message: "something is wrong"
    //         }])
    //     })
    // }
}

exports.getCategoryByNameForAdmin = (req, res) => {
    // console.log("here1");
    // if(req.headers.lang == 'ar' || req.headers.lang == 'en') {
    category.findOne({ $or: [{ name: req.params.categoryName }, { arName: req.params.categoryName }] }).then(category => {
        res.status(200).send(category);
        // console.log("here2");
    }).catch(err => {
        // console.log("here3");
        res.status(401).send([err, {
            message: "something is wrong"
        }])
    })
    // }
}

// exports.createCategoryByAdmin = (req, res) => {
//     // const file = new SingleFile({
//     //     // fileName: req.files.originalname,
//     //     filePath: req.files.path,
//     //     // fileType: req.filse.mimetype,
//     //     // fileSize: fileSizefilesFormatter(req.file.size, 2) // 0.00
//     // });
//     //  file.save();
//     // res.status(201).send('File Uploaded Successfully');
   
    
//     category.findOne({ name: req.body.name }, (err, categoryAlreadyExisted) => {
//         if (err) { res.status(200).send(err) };
//         if (categoryAlreadyExisted) {
//             res.status(403).json({ error: "This Category is already existed" });
//         } else {
//             if (!req.body.parent) {
//                 console.log("fudsafkadsfklads");
//                 const newCategory = category({
//                     name: req.body.name,
//                     arName: req.body.arName,
//                     // image: req.files.path
//                 })
//                 newCategory.save().then((savedCat) => {
//                     res.status(200).send(savedCat)
//                 }).catch((err => {
//                     res.status(401).send(err)
//                 }))
//             } else {
//                 category.findOneAndUpdate({ name: req.body.parent }
//                     , {
//                         "$push": {
//                             subCategories: {
//                                 name: req.body.name,
//                                 // image: req.files,
//                                 arName: req.body.arName,
//                             },
//                         }
//                     }, (err, category) => {
//                         if (err) {
//                             res.status(402).send([err, {
//                                 message: "somthing wrong..2.."
//                             }])
//                         };
//                         if (category) {
//                             res.status(201).send(category)
//                         }
//                     });
//             }
//         }
//     })

// }
exports.deleteSubCategory = async (req, res) => {
    await category.findOne({ "subCategories.name": req.params.name }).then(category=>{
        // console.log(category)
        const subs = category.subCategories.filter(sub=>sub.name!=req.params.name)
        category.subCategories = subs
        category.save().then(cat=>res.status(200).send(cat))
            .catch(err=>{
                res.status(404).send(err)
            })
        
    }).catch(err=>{
        res.status(404).send(err)
    })

};
//Update Category
// exports.updateCategory = (req, res) => {
//     // console.log("update1", req.params.id);
//     category.findByIdAndUpdate(req.params.id, {
//         name: req.body.name,
//         arName: req.body.arName
//     }, { new: true })

//         .then(cat => {
//             // console.log("update2");
//             res.status(200).send(cat)
//         }).catch((err) => {
//             res.status(400).send(err)
//         })
// }
exports.updateCategory = (req, res) => {
    const filesPath = [];
    const filesArray = [];
    req.files.forEach(element => {
        const file = {
            fileName: element.originalname,
            filePath: element.path,
            fileType: element.mimetype,
            fileSize: fileSizeFormatter(element.size, 2)
        }
        filesArray.push(file);
        filesPath.push(element.path);
    });
    const multipleFiles = new MultipleFile({
        files: filesArray
    });
    multipleFiles.save();
    // console.log("update1", req.params.id);
    category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        arName: req.body.arName,
        image: filesPath
    }, { new: true })

        .then(cat => {
            // console.log("update2");
            res.status(200).send(cat)
        }).catch((err) => {
            res.status(400).send(err)
        })
}


exports.getSubCategoryByIdForAdmin = (req, res) => {
    console.log("here sub1");
try{
    category.findOne({ "subCategories._id": req.params.id }
        , (err, category) => {
            if (err) { res.status(400).send(err) }
            if (category) {
                const subCat = category.subCategories.find(elem => elem._id == req.params.id)
                if (subCat) {
                    res.status(200).send(subCat);
                    console.log("heresub2");
                } else {
                    res.status(401).send({
                        message: "something is wrong1"
                    })
                }

            } else {
                res.status(401).send({
                    message: "something is wrong2"
                })
            }
        }
    )}
    catch(err) {
        console.log("here sub3");
        res.status(401).send([err, {
            message: "something is wrong3"
        }])
    }

}




// exports.updateSubCategoryByIdForAdmin = (req, res) => {
//     console.log("update sub1");
// try{
//     category.findOne({ "subCategories._id": req.params.id }
//         , (err, category) => {
//             if (err) { res.status(400).send(err) }
//             if (category) {
//                 const subCat = category.subCategories.find(elem => elem._id == req.params.id)
//                 if (subCat) {
                    
//                     subCat.name=req.body.name,
//                     subCat.arName=req.body.arName
//                     category.save();
//                     res.status(200).send(subCat);
//                     console.log("updatesub2");
//                 } else {
//                     res.status(401).send({
//                         message: "something is wrong1"
//                     })
//                 }

//             } else {
//                 res.status(401).send({
//                     message: "something is wrong2"
//                 })
//             }
//         }
//     )}
//     catch(err) {
//         console.log("update sub3");
//         res.status(401).send([err, {
//             message: "something is wrong3"
//         }])
//     }

// }

exports.getAllCategoryAdmin = (req, res) => {
  
    category.find({}).then(document => {
        res.status(200).send(document);
    }).catch(err => {
        res.status(401).send([err, {
            message: "wrong something is wrong "
        }])
    })

}

//////////////////////////////////////////////

exports.getAllCategorypagination = async (req, res) => {
try {
    let query = category.find();

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await category.countDocuments();

    const pages = Math.ceil(total / pageSize);

    query = query.skip(skip).limit(pageSize);

    if (page > pages) {
        return res.status(404).json({
            status: "fail",
            message: "No page found",
        });
    }

    const result = await query;

    res.status(200).json({
        status: "success",
        count: result.length,
        page,
        pages,
        data: result,
    });
} catch (error) {
    console.log(error);
    res.status(500).json({
        status: "error",
        message: "Server Error",
    });
}
};



exports.updateSubCategoryByIdForAdmin = (req, res) => {
    console.log(req.files)
    const filesPath = [];
    const filesArray = [];
    req.files.forEach(element => {
        const file = {
            fileName: element.originalname,
            filePath: element.path,
            fileType: element.mimetype,
            fileSize: fileSizeFormatter(element.size, 2)
        }
        filesArray.push(file);
        filesPath.push(element.path);
    });
    const multipleFiles = new MultipleFile({
        files: filesArray
    });
    multipleFiles.save();
    console.log("update sub1");
try{
    category.findOne({ "subCategories._id": req.params.id }
        , (err, category) => {
            if (err) { res.status(400).send(err) }
            if (category) {
                const subCat = category.subCategories.find(elem => elem._id == req.params.id)
                if (subCat) {
                    
                    subCat.name=req.body.name,
                    subCat.arName=req.body.arName,
                    subCat.image= filesPath
                    category.save();
                    res.status(200).send(subCat);
                    console.log("updatesub2");
                } else {
                    res.status(401).send({
                        message: "something is wrong1"
                    })
                }

            } else {
                res.status(401).send({
                    message: "something is wrong2"
                })
            }
        }
    )}
    catch(err) {
        console.log("update sub3");
        res.status(401).send([err, {
            message: "something is wrong3"
        }])
    }

}