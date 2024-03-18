import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Loader from "./Components/Loader";
import Select from "react-select";
import Modal from "react-modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../Interceptors/Interceptor";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    textAlign: "center",
  },
};

const EditProduct = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const prod_id = queryParams.get("id");
  const [Product, setProduct] = useState();
  const [CategoryList, setCategoryList] = useState();
  const [ClassificationList, setClassificationList] = useState();
  const [BrandList, setBrandList] = useState();
  const [Brand, setBrand] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState();
  const [stock, setStock] = useState(false);
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [shortCode, setShortCode] = useState();
  const [brandId, setbrandId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mrp, setMrp] = useState(0);
  const [stars, setStars] = useState(0);
  const [price, setPrice] = useState();
  const [createdBy, setCreatedBy] = useState();
  const [gst, setGst] = useState("0%");
  const [sgstAmount, setSgstAmount] = useState();
  const [cgstAmount, setCgstAmount] = useState();
  const [igstAmount, setIgstAmount] = useState();
  const navigate = useNavigate();
  const [formError, setFormError] = useState({});
  const [weight, setWeight] = useState(0);
  const [selectedOption, setSelectedOption] = useState([]);
  // const [GenericList, setGenericList] = useState([]);
  const [inputImage, setInputImage] = useState([]);
  const [uploadProductImage, setUploadProductImage] = useState(null);
  const [sequence, setSequence] = useState(1);
  const [isMainImage, setIsMainImage] = useState(false);
  console.log({ inputImage });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedClassification, setSelectedClassification] = useState(null);
  const [navigateToList, setNavigateToList] = useState(false);
  const [minorderqty, setminorderqty] = useState(0);
  const [maxorderqty, setmaxorderqty] = useState(0);
  const [ProductAllImages, setProductAllImages] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modelIsOpen, setModelIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deletedId, setDeletedId] = useState(null);
  const [isProductActive, setIsProductActive] = useState(true);
  const [priority, setPriority] = useState(0);
  const [disOnMRP, setDisOnMRP] = useState(0);
  const [genericList, setGenericList] = useState([]);
  const [selectedGeneric, setSelectedGeneric] = useState(null);
  function openModal(e, id) {
    setIsOpen(true);
    setDeleteId(id);
  }
  function closeModal() {
    setIsOpen(false);
    setDeleteId(null);
  }

  function openModel(e, prod_id) {
    setModelIsOpen(true);
    setDeletedId(prod_id);
  }

  function closeModel() {
    setModelIsOpen(false);
    setDeletedId(null);
  }

  useEffect(() => {
    if (navigateToList) {
      const timer = setTimeout(() => {
        navigate("/products-list");
      }, 2000);

      return () => {
        clearTimeout(timer);
        setNavigateToList(false);
      };
    }
  }, [navigateToList]);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const userid = window.localStorage.getItem("userid");
    if (token) {
      setToken(token);
      setCreatedBy(userid);
    } else {
      window.location.href = "/login";
      return;
    }

    async function FetchProductCategoriesBrandsGenerics() {
      try {
        const requestOptions = {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        setIsLoading(true);

        const [
          productResponse,
          brandResponse,
          categoryResponse,
          genericResponse,
          productGenericResponse,
          classificationResponse,
          productImagesResponse,
        ] = await Promise.all([
          api.get(`/api/app/Products/${prod_id}`, requestOptions),
          api.get("/api/app/Brands", requestOptions),
          api.get("/api/app/Categories", requestOptions),
          api.get("/api/app/Generics/", requestOptions),
          api.get(
            `/api/app/Generics/LoadGenericByProduct/${prod_id}`,
            requestOptions
          ),
          api.get("/api/app/Classifications", requestOptions),
          api.get(`/api/app/productimages/all/${prod_id}`, requestOptions),
        ]);
        const dat = productResponse.data;
        console.log("Product", productResponse);
        setProduct(dat);
        setName(dat.name);
        setShortName(dat.shortName);
        setDescription(dat.description);
        setShortCode(dat.shortCode);
        setbrandId(dat.brandId);
        setImageUrl(dat.imageUrl);
        setPrice(dat.price);
        setWeight(dat.weight);
        setStock(dat.stock);
        setPriority(dat.priority);
        setCreatedBy(dat.createdBy);
        setGst(dat.gst);
        setSelectedOption(dat.id);
        setSgstAmount(dat.sgstAmount);
        setCgstAmount(dat.cgstAmount);
        setIgstAmount(dat.igstAmount);
        setminorderqty(dat.minOrderQty);
        setmaxorderqty(dat.maxOrderQty);
        setIsProductActive(dat?.active);
        setStars(dat?.stars);
        setDisOnMRP(dat?.disOnMRP);
        setMrp(dat?.mrp);
        const t = {
          value: dat?.classification?.id,
          id: dat?.classification?.id,
          name: dat?.classification?.name,
          label: dat?.classification?.name,
        };
        setSelectedClassification(t);
        const tt = {
          value: dat?.brands?.id,
          id: dat?.brands?.id,
          name: dat?.brands?.name,
          label: dat?.brands?.name,
        };
        setSelectedBrand(tt);
        setSelectedCategory(
          dat?.productCategories?.map((x) => {
            return {
              value: x?.categories?.id,
              id: x?.categories?.id,
              name: x?.categories?.name,
              label: x?.categories?.name,
            };
          })
        );

        FetchBrand(dat.brandId);

        setBrandList(brandResponse.data);
        setCategoryList(categoryResponse.data);
        // setGenericList(genericResponse.data);
        setSelectedOption(
          productGenericResponse.data.map((x) => ({
            value: x.id,
            id: x.id,
            name: x.name,
            label: x.name,
          }))
        );
        setClassificationList(classificationResponse.data);
        setProductAllImages(productImagesResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching data..", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsLoading(false);
      }
    }

    async function FetchGeneric(productResponse) {
      try {
        const requestOptions = {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
    
        const genericResponse = await api.get("/api/app/Generics", requestOptions);
        const generics = genericResponse.data;
        setGenericList(generics);
    
        if (productResponse && productResponse.data && productResponse.data.generic) {
          const productGeneric = productResponse.data.generic;
          const foundGeneric = generics.find((generic) => generic.id === productGeneric.id);
          
          if (foundGeneric) {
            const selectedGeneric = {
              value: foundGeneric.id,
              id: foundGeneric.id,
              name: foundGeneric.name,
              label: foundGeneric.name,
            };
            setSelectedGeneric(selectedGeneric);
          }
        }
      } catch (error) {
        console.error("Error fetching generics:", error);
      }
    }
    
    

    FetchProductCategoriesBrandsGenerics();
    FetchGeneric();
    async function FetchBrand(id) {
      try {
        const requestOptions = {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.get(`/api/app/Brands/${id}`, requestOptions);
        const data = response.data;
        setBrand(data);
        setbrandId(data.id);
      } catch (error) {
        console.error("Error fetching brand:", error);
        toast.error("An error occurred while fetching brand..", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  }, []);

  useEffect(() => {
    const calculatedPrice = mrp - mrp * (disOnMRP / 100);
    setPrice(calculatedPrice);
  }, [mrp, disOnMRP]);

  async function FetchImages() {
    try {
      const requestOptions = {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.get(
        `/api/app/productimages/all/${prod_id}`,
        requestOptions
      );
      const dataaaaaa = response.data;
      setProductAllImages(dataaaaaa);
      console.log({ images: dataaaaaa });
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("An error occurred while fetching images..", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  const options =
    genericList &&
    genericList?.map((Generic) => {
      // console.log({ id: Generic?.id, name: Generic?.name, label: Generic?.name })
      return {
        value: Generic?.id,
        id: Generic?.id,
        name: Generic?.name,
        label: Generic?.name,
      };
    });

  const categoryOptions =
    CategoryList &&
    CategoryList?.map((Category) => {
      return {
        value: Category?.id,
        id: Category?.id,
        name: Category?.name,
        label: Category?.name,
      };
    });

  const brandOptions =
    BrandList &&
    BrandList?.map((Brand) => {
      return {
        value: Brand?.id,
        id: Brand?.id,
        name: Brand?.name,
        label: Brand?.name,
      };
    });

  const classificationOptions =
    ClassificationList &&
    ClassificationList?.map((Classification) => {
      return {
        value: Classification?.id,
        id: Classification?.id,
        name: Classification?.name,
        label: Classification?.name,
      };
    });

  // console.log({ selectedOption })

  function selectImage(e) {
    e.preventDefault();
    const { files } = e.target;
    const imageFile = files[0];
    setUploadProductImage(imageFile);
    let images = [];
    const selecteds = [...[...files]];
    selecteds.forEach((i) => images.push(URL.createObjectURL(i)));
    setInputImage(images);
  }

  // async function uploadImage(e) {
  //   e.preventDefault();
  //   if (uploadProductImage === null) {
  //     toast.warning("Image is Required!", {
  //       position: "top-right",
  //       autoClose: 2000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("images", uploadProductImage);

  //   const requestOptions2 = {
  //     method: "POST",
  //     headers: {
  //       Accept: "*/*",
  //       Authorization: "Bearer " + token,
  //     },
  //     body: formData,
  //   };
  //   // let max = 0;
  //   // for (let i = 0; i < ProductAllImages.length; i++) {
  //   //   if (ProductAllImages[i].sequence > max) {
  //   //     max = ProductAllImages[i].sequence;
  //   //   }
  //   //   setSequence(max + 1);
  //   // }

  //   let newSequence = sequence;

  //   if (ProductAllImages.length > 0) {
  //     const maxSequence = Math.max(...ProductAllImages.map((image) => image.sequence));
  //     newSequence = maxSequence + 1;
  //   }

  //   setSequence(newSequence);

  //   await fetch(
  //     `${process.env.REACT_APP_API_BASE_URL}/api/app/ProductImages/${prod_id}/${sequence}/${isMainImage}`,
  //     requestOptions2
  //   )
  //     .then((dataa) => {
  //       console.log({ dataa });

  //       // FetchCategories();
  //       toast.success("Image added Successfully..", {
  //         position: "top-right",
  //         autoClose: 2000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       });
  //       window.location.reload();
  //     })
  //     .catch((e) => {
  //       // window.location.reload()
  //       console.log("error here", e);
  //     });

  //   // console.log({ isMainImage, sequence, uploadProductImage, prod_id })
  // }
  async function uploadImage(e) {
    e.preventDefault();
    if (uploadProductImage === null) {
      toast.warning("Image is Required!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    const formData = new FormData();
    formData.append("images", uploadProductImage);

    try {
      let newSequence = 1;

      if (ProductAllImages.length > 0) {
        const maxSequence = Math.max(
          ...ProductAllImages.map((image) => image.seq)
        );
        newSequence = maxSequence + 1;
      }

      setSequence(newSequence);

      const response = await api.post(
        `/api/app/ProductImages/${prod_id}/${newSequence}/${isMainImage}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct Content-Type
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log({ response });

      toast.success("Image added Successfully..", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading image..", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  async function handleChangeStatus(e) {
    try {
      const response = await api.post(
        `/api/app/Products/ToggleProductActive/${prod_id}`,
        {},
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataa = response.data;

      setIsProductActive(dataa?.active);
      toast.success("Status Changed Successfully..", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("An error occurred while changing status..", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  if (isLoading) {
    return <Loader />;
  }
  if (!CategoryList) {
    return <Loader />;
  }
  if (!BrandList) {
    return <Loader />;
  }
  if (!Product) {
    return <Loader />;
  }
  if (!Brand) {
    return <Loader />;
  }

  async function handleProductDelete(e) {
    console.log("Delete button clicked");
    e.preventDefault();

    try {
      if (prod_id === null) {
        toast.error("Something went wrong..", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      const requestOptions = {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.delete(
        `/api/app/Products/${prod_id}`,
        requestOptions
      );
      const data = response.data;
      console.log("deleted data: ", data);
      toast.success("Product deleted Successfully..", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      closeModel();
      setTimeout(() => {
        navigate("/products-list");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete Product..", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  async function handleDelete(e) {
    e.preventDefault();

    try {
      const requestOptions = {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.delete(
        `/api/app/productimages/${deleteId}`,
        requestOptions
      );
      console.log("deleted: ", response);
      toast.success("Image deleted Successfully..", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      closeModal();
      FetchImages();
    } catch (error) {
      closeModal();
      console.log(error);
    }
  }

  async function UpdateProduct() {
    const errors = {};
    if (!name) {
      errors.name = "Name of the product is required!";
    }
    if (!selectedClassification) {
      errors.classification = "Classification is required!";
    }
    if (!selectedBrand) {
      errors.selectedBrand = "Brand is required!";
    }
    if (!price) {
      errors.price = "Price is required!";
    }

    if (name) {
      delete errors.name;
      setFormError(errors);
    }
    if (selectedClassification) {
      delete errors.selectedClassification?.id;
      setFormError(errors);
    }
    if (selectedBrand) {
      delete errors.selectedBrand?.id;
      setFormError(errors);
    }

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    if (!name || !price || !selectedBrand || !selectedClassification) {
      toast.info("Name, Price, Brand, and Classification are required!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      try {
        const response = await api.put(`/api/app/Products/${prod_id}`, {
          id: parseInt(prod_id),
          name: name,
          shortName: shortName,
          description: description,
          shortCode: shortCode,
          brandId: selectedBrand?.id,
          price: parseFloat(price),
          stock: true,
          priorityTag: parseInt(priority),
          type: "normal",
          active: true,
          createdBy: 1,
          updatedAt: "2023-02-13T06:05:59.372Z",
          createdAt: "2023-02-13T06:05:59.372Z",
          gst: parseFloat(gst),
          sgstAmount: 0,
          cgstAmount: 0,
          igstAmount: 0,
          classificationId: selectedClassification?.id,
          // genericId: selectedGenericId?.id,
          stock: true,
          weight: parseInt(weight),
          mrp: parseFloat(mrp),
          disOnMRP: parseInt(disOnMRP),
          maxOrderQty: parseFloat(maxorderqty),
          minOrderQty: parseFloat(minorderqty),
          couponPrice: 0,
          productCategories: selectedCategory?.map((opt) => opt?.id),
          stars: 0,
          mrp: 0,
        });

        if (response.status === 204) {
          toast.success("Product Updated Successfully..", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setNavigateToList(true);
        } else {
          toast.error("Product already exists", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        await setGenericsToProduct();
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to update Product..", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  }

  async function setGenericsToProduct() {
    try {
      const response = await api.post("/api/app/Generics/SetGenericToProduct", {
        productId: prod_id,
        genericIds: selectedOption.map((opt) => opt.id),
      });
  
      if (response.status === 200) {
        toast.success("Generics Added Successfully..");
      } else {
        toast.error("Failed to add generics");
      }
    } catch (error) {
      console.error("Error adding generics:", error);
      toast.error("Failed to add generics");
    }
  }

  return (
    <>
      <ToastContainer />
      <Sidebar page="ProductsList" />
      <main className="main-wrap">
        <Navbar />
        <section className="content-main">
          <div>
            <button
              onClick={() => navigate("/products-list")}
              className="btn btn-md rounded font-sm hover-up"
              style={{ marginLeft: "4px" }}
            >
              &larr; Go Back
            </button>
          </div>

          {/* <ArrowBackIcon id="arrow-back" onClick={() => navigate(-1)} /><span>back</span> */}
          <div className="row">
            <div className="col-9">
              <div className="content-header">
                <h2 className="content-title">Edit Product {name}</h2>
                <div>
                  <button
                    className="btn btn-md rounded font-sm hover-up"
                    onClick={UpdateProduct}
                  >
                    Update Product
                  </button>
                  <button
                    className="btn btn-danger btn-sm m-2"
                    onClick={(e) => openModel(e, prod_id)}
                    style={{
                      marginLeft: "50px",
                    }}
                  >
                    Delete
                  </button>
                  <Modal
                    isOpen={modelIsOpen}
                    onAfterClose={closeModel}
                    ariaHideApp={false}
                    style={customStyles}
                    contentLabel="Example Label"
                  >
                    <form>
                      <h2>Delete Product</h2>
                      <p>Are you sure you want to delete this product?</p>
                      <button
                        className="btn btn-danger btn-sm m-2"
                        onClick={handleProductDelete}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={closeModel}
                      >
                        Cancel{" "}
                      </button>
                    </form>
                  </Modal>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card mb-4">
                <div className="card-body">
                  <form>
                    <div className="mb-4">
                      <label htmlFor="product_name" className="form-label">
                        Product Name
                      </label>
                      <span style={{ color: "red" }}> *</span>
                      <input
                        type="text"
                        value={name}
                        placeholder="Type here"
                        className="form-control"
                        id="product_name"
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      {formError.name && (
                        <span style={{ color: "red" }}>{formError.name}</span>
                      )}
                    </div>
                    <div className="row gx-2">
                      <div className="col-sm-12 mb-3">
                        <label className="form-label">Category</label>

                        <Select
                          defaultValue={selectedCategory}
                          onChange={setSelectedCategory}
                          options={categoryOptions && categoryOptions}
                          isMulti={true}
                        />
                      </div>
                    </div>

                    <div className="row gx-2">
                      <div className="col-sm-12 mb-3">
                        <label className="form-label">Classification</label>
                        <span style={{ color: "red" }}> *</span>
                        <Select
                          defaultValue={selectedClassification}
                          onChange={setSelectedClassification}
                          options={
                            classificationOptions && classificationOptions
                          }
                          isMulti={false}
                        />
                        {formError.selectedClassification && (
                          <span style={{ color: "red" }}>
                            {formError.selectedClassification}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="row gx-2">
                      <div className="col-sm-12 mb-3">
                        <label className="form-label">Brand</label>{" "}
                        <span style={{ color: "red" }}> *</span>
                        <Select
                          defaultValue={selectedBrand}
                          onChange={setSelectedBrand}
                          options={brandOptions && brandOptions}
                          isMulti={false}
                        />
                        {formError.selectedClassification && (
                          <span style={{ color: "red" }}>
                            {formError.selectedClassification}
                          </span>
                        )}
                      </div>

                      <div className="row gx-2">
                        <div className="col-sm-12 mb-3">
                          <label className="form-label">Generic</label>
                          <Select
                            defaultValue={selectedGeneric}
                            onChange={setSelectedGeneric}
                            options={genericList.map((generic) => ({
                              value: generic.id,
                              id: generic.id,
                              name: generic.name,
                              label: generic.name,
                            }))}
                            isMulti={true}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-4">
                          <label
                            htmlFor="product_shortname"
                            className="form-label"
                          >
                            Product ShortName
                          </label>
                          <input
                            type="text"
                            value={shortName}
                            placeholder="Type here"
                            className="form-control"
                            id="product_shortname"
                            onChange={(e) => setShortName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-4">
                          <label
                            htmlFor="product_shortcode"
                            className="form-label"
                          >
                            Product ShortCode
                          </label>
                          <input
                            type="text"
                            value={shortCode}
                            placeholder="Type here"
                            className="form-control"
                            id="product_shortcode"
                            onChange={(e) => setShortCode(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-4">
                          <label
                            htmlFor="product_shortname"
                            className="form-label"
                          >
                            Min Order Quantity
                          </label>
                          <input
                            type="number"
                            value={minorderqty}
                            min="0"
                            placeholder="Type here"
                            onChange={(e) => setminorderqty(e.target.value)}
                            className="form-control"
                            id="product_min_qty"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-4">
                          <label
                            htmlFor="product_shortcode"
                            className="form-label"
                          >
                            Max Order Quantity
                          </label>
                          <input
                            type="number"
                            value={maxorderqty}
                            min="0"
                            placeholder="Type here"
                            onChange={(e) => setmaxorderqty(e.target.value)}
                            className="form-control"
                            id="product_max_qty"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="product_description"
                        className="form-label"
                      >
                        Full description
                      </label>
                      <textarea
                        placeholder="Type here"
                        className="form-control"
                        rows="4"
                        id="product_description"
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">MRP</label>
                      <input
                        type="number"
                        value={mrp}
                        min="0"
                        // placeholder="weight"
                        className="form-control"
                        id="mrp"
                        onChange={(e) => setMrp(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Discount on MRP(%)</label>
                      <input
                        type="number"
                        value={disOnMRP}
                        min="0"
                        // placeholder="weight"
                        className="form-control"
                        id="mrp"
                        onChange={(e) => setDisOnMRP(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="product_price" className="form-label">
                        Product Price
                      </label>{" "}
                      <span style={{ color: "red" }}> *</span>
                      <input
                        disabled={true}
                        type="number"
                        min="0"
                        value={price}
                        placeholder="₹"
                        className="form-control"
                        id="product_price"
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                      {formError.price && (
                        <span style={{ color: "red" }}>{formError.price}</span>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Stock</label>
                      <select
                        value={stock}
                        className="form-select"
                        id="stock"
                        onChange={(e) => setStock(e.target.value === "true")}
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Weight</label>
                      <input
                        type="number"
                        value={weight}
                        min="0"
                        // placeholder="weight"
                        className="form-control"
                        id="weight"
                        onChange={(e) => setWeight(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Stars</label>
                      <input
                        type="number"
                        value={stars}
                        min="0"
                        // placeholder="weight"
                        className="form-control"
                        id="stars"
                        onChange={(e) => setStars(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="product_priority" className="form-label">
                        Product Priority
                      </label>{" "}
                      <input
                        type="number"
                        min="0"
                        value={priority ?? 0}
                        className="form-control"
                        id="product_priority"
                        onChange={(event) => setPriority(event.target.value)}
                      />
                    </div>

                    <div className="row gx-2">
                      <div className="col-sm-12 mb-3">
                        <label className="form-label">GST Percentage</label>{" "}
                        <select
                          value={gst}
                          className="form-select"
                          id="gst"
                          onChange={(e) => setGst(e.target.value)}
                          required
                        >
                          <option>Select GST Percentage</option>
                          <option value="0">0%</option>
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-header">
                  <h4>Change Status</h4>
                </div>
                <div className="card-body">
                  {isProductActive === true ? (
                    <button
                      className="btn btn-md rounded font-sm hover-up"
                      onClick={handleChangeStatus}
                    >
                      Enabled
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger rounded font-sm hover-up"
                      onClick={handleChangeStatus}
                    >
                      Disabled
                    </button>
                  )}
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-header">
                  <h4>Product Image</h4>
                </div>
                <div className="card-body">
                  {/* <div className="mb-4">
                    <label className="form-label">Sequence</label>
                    <input
                      type="text"
                      // placeholder="e.g: 1"
                      value={sequence}
                      className="form-control"
                      id="gst"
                      onChange={(e) => setSequence(e.target.value)}
                    />
                  </div> */}

                  <div className="mb-4">
                    <label className="form-label">Main Image</label>
                    <select
                      className="form-select"
                      onChange={(e) => setIsMainImage(e.target.value)}
                    >
                      <option value="false">False</option>
                      <option value="true">True</option>
                    </select>
                  </div>

                  <div className="input-upload">
                    {inputImage.length < 1 ? (
                      <img src="assets/imgs/theme/upload.svg" alt="" />
                    ) : (
                      inputImage.map((i) => <img key={i} src={i} alt="" />)
                    )}

                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      onChange={selectImage}
                    />
                  </div>

                  <button
                    className="btn btn-md rounded font-sm hover-up"
                    onClick={uploadImage}
                  >
                    Add Image
                  </button>
                  <div>
                    <h4>Product Images</h4>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              {/* <th>ID</th> */}
                              <th>Sequence</th>
                              <th>Image</th>

                              <th
                                style={{
                                  fontSize: "12px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Is Main
                              </th>
                              <th className="text-end">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ProductAllImages?.length > 0
                              ? ProductAllImages.map((item) => (
                                  <tr key={item.id}>
                                    {/* <td>{item.id}</td> */}
                                    <td>{item?.seq}</td>
                                    <td>
                                      <img
                                        src={item?.imageUrl}
                                        alt={item.id}
                                        width="30px"
                                      />
                                    </td>
                                    <td>
                                      {item?.main === true ? "Yes" : "No"}
                                    </td>
                                    <td className="text-end">
                                      <div className="dropdown">
                                        <a
                                          href="#"
                                          data-bs-toggle="dropdown"
                                          className="btn btn-light rounded btn-sm font-sm"
                                        >
                                          {" "}
                                          <i className="material-icons">
                                            more_horiz
                                          </i>{" "}
                                        </a>
                                        <div className="dropdown-menu">
                                          <a
                                            className="dropdown-item text-danger"
                                            onClick={(e) =>
                                              openModal(e, item?.id)
                                            }
                                          >
                                            Delete
                                          </a>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              : "No images Added"}
                            <Modal
                              isOpen={modalIsOpen}
                              ariaHideApp={false}
                              onAfterClose={closeModal}
                              style={customStyles}
                              contentLabel="Example Label"
                            >
                              <form>
                                <h2>Delete Product Images</h2>
                                <p>
                                  Are you sure you want to delete this product
                                  image?
                                </p>
                                <button
                                  className="btn btn-danger btn-sm m-2"
                                  onClick={handleDelete}
                                >
                                  Delete
                                </button>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={closeModal}
                                >
                                  Cancel{" "}
                                </button>
                              </form>
                            </Modal>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};

export default EditProduct;
