import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/loader";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import videoCover from "../assets/videos/cover.mp4";
import { FaAnglesDown, FaHeadset } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Slider } from "6pp";
import { TbTruckDelivery } from "react-icons/tb";
import { LuShieldCheck } from "react-icons/lu";

const clients = [
  {
    src: "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744564768/Styl_brygkr.jpg",
    alt: "react",
  },
  {
    src: "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744564767/Clothes_zpfjdj.jpg",
    alt: "node",
  },
  {
    src: "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744564768/Dapper_fovdfb.jpg",
    alt: "mongodb",
  },
  {
    src: "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744564768/Stop_and_shopp___qss9wf.jpg",
    alt: "express",
  },
  {
    src: "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744564767/Collection_By_Manav_naayrr.jpg",
    alt: "redux",
  },
  {
    src: "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744564768/Zivara_nwxo4w.jpg",
    alt: "typescript",
  },
  {
    src: "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744564768/Streetsole_Boutique_n9i32c.jpg",
    alt: "sass",
  },
  {
    src: "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744564768/Verses_Store_pppafg.jpg",
    alt: "firebase",
  },
  {
    src: "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744564768/Streetsole_Boutique_n9i32c.jpg",
    alt: "figma",
  },

];

const banners = [
  "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744650336/aaf8c01e-031d-4ead-b868-94abf9cad670_aqebem.jpg",
  "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744650336/output_5_jxuh9i.jpg",
  "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744650337/output_2_zmonlv.jpg",
  "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744650337/output_aeqici.jpg",
  "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744650336/output_3_smxa6b.jpg",
  "https://res.cloudinary.com/ddfbxzzum/image/upload/v1744650336/output_4_uci7fm.jpg"
];
const categories = [
  "Electronics",
  "Mobiles",
  "Laptops",
  "Books",
  "Fashion",
  "Appliances",
  "Furniture",
  "Home Decor",
  "Grocery",
  "Beauty",
  "Toys",
  "Fitness",
];

const services = [
  {
    icon: <TbTruckDelivery />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $200",
  },
  {
    icon: <LuShieldCheck />,
    title: "SECURE PAYMENT",
    description: "100% secure payment",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 SUPPORT",
    description: "Get support 24/7",
  },
];

const Home = () => {
  const { data, isError, isLoading } = useLatestProductsQuery("");

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) toast.error("Cannot Fetch the Products");

  const coverMessage =
    "Shopping isn't just buying; it's a cultural journey. Local goods and flavors speak volumes, a celebration with every crafted piece. It's a way to support stories, a community builder, or mindful choice. From heritage to innovation, MercatoHub connects us all.".split(
      " "
    );

  return (
    <>
      <div className="home">
        <section></section>

        <div>
          <aside>
            <h1>Categories</h1>
            <ul>
              {categories.map((i) => (
                <li key={i}>
                  <Link to={`/search?category=${i.toLowerCase()}`}>{i}</Link>
                </li>
              ))}
            </ul>
          </aside>
          <Slider
            autoplay
            autoplayDuration={2500}
            showNav={false}
            images={banners}
          />
        </div>

        <h1>
          Latest Products
          <Link to="/search" className="findmore">
            More
          </Link>
        </h1>

        <main>
          {isLoading ? (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ height: "25rem" }}>
                  <Skeleton width="18.75rem" length={1} height="20rem" />
                  <Skeleton width="18.75rem" length={2} height="1.95rem" />
                </div>
              ))}
            </>
          ) : (
            data?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photos={i.photos}
              />
            ))
          )}
        </main>
      </div>

      <article className="cover-video-container">
        <div className="cover-video-overlay"></div>
        <video autoPlay loop muted src={videoCover} />
        <div className="cover-video-content">
          <motion.h2
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            MercatoHub
          </motion.h2>
          {coverMessage.map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              {el}{" "}
            </motion.span>
          ))}
        </div>
        <motion.span
          animate={{
            y: [0, 10, 0],
            transition: {
              duration: 1,
              repeat: Infinity,
            },
          }}
        >
          <FaAnglesDown />
        </motion.span>
      </article>

      <article className="our-clients">
        <div>
          <h2>Our Clients</h2>
          <div>
            {clients.map((client, i) => (
              <motion.img
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: i / 20,
                    ease: "circIn",
                  },
                }}
                src={client.src}
                alt={client.alt}
                key={i}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: -100 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: clients.length / 20,
              },
            }}
          >
            Trusted By 20+ Companies 
          </motion.p>
        </div>
      </article>

      <hr
        style={{
          backgroundColor: "rgba(0,0,0,0.1)",
          border: "none",
          height: "1px",
        }}
      />

      <article className="our-services">
        <ul>
          {services.map((service, i) => (
            <motion.li
              initial={{ opacity: 0, y: -100 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: i / 20,
                },
              }}
              key={service.title}
            >
              <div>{service.icon}</div>
              <section>
                <h3>{service.title}Y</h3>
                <p>{service.title}</p>
              </section>
            </motion.li>
          ))}
        </ul>
      </article>
    </>
  );
};

export default Home;
