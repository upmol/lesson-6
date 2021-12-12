const goods = [
  {
    title: "Shirt",
    price: "150$",
    img:
      "https://images.pexels.com/photos/1188748/pexels-photo-1188748.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  },
  {
    title: "Socks",
    price: "50$",
    img:
      "https://images.unsplash.com/photo-1616531758364-731625b1f273?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    title: "Jacket",
    price: "350$",
    img:
      "https://images.pexels.com/photos/3770674/pexels-photo-3770674.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
  },
  {
    title: "Shoes",
    price: "250$",
    img:
      "https://images.pexels.com/photos/4277507/pexels-photo-4277507.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
  },
  {},
  {},
  {},
  {},
];

const reformData = (items) => {
  return items.map(({ product_name, ...rest }) => {
    return {
      ...rest,
      title: product_name,
    };
  });
};

const URl =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

const GOODS_POSTFIX = "/catalogData.json ";
const GET_BASKET = "/getBasket.json";
const ADD_BASKET = "/addToBasket.json";
const DELETE_FROM_BASKET = "/deleteFromBasket.json";

const service = function (url, postfix, method = "GET") {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch(`${url}${postfix}`, {
        method,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          resolve(data);
        });
    }, 1000);
  });
};

class Basket {
  setGoods() {
    return service(URl, GET_BASKET).then((data) => {
      this.goods = reformData(data.contents);
    });
  }
  deleteGoodsToBasket(id) {
    return service(
      URl,
      `${DELETE_FROM_BASKET}/${id}`,
      "DELETE"
    ).then((data) => {});
  }
  setVision() {}
  render() {}
}
class BasketItem {
  setCount() {}
  deleteItem() {}
  render() {}
}

onload = () => {
  Vue.component("goods-item", {
    props: ["item"],
    template: `
    <div class="goods-item">
            <img
              src="https://images.unsplash.com/photo-1526570207772-784d36084510?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80"
            />
            <h3>{{item.title }}</h3>
            <p>{{item.price}}</p>
            <button>ДОБАВИТЬ</button>
          </div>
    `,
  });
  Vue.component("close-button", {
    props: ["click"],
    template: `
    <i class="fas fa-times" @click="$emit('click')"></i>
    `,
  });

  Vue.component("basket", {
    props: ["close"],
    data: function () {
      return {
        basketGoods: [],
      };
    },
    template: `
    <div class="header__basket_card">
    <close-button @click="$emit('close')"></close-button>
    <div>
    <basket-item v-for="item in basketGoods" :item="item"></basket-item>
    </div>
          </div>
    `,
    mounted() {
      service(URl, GET_BASKET).then((data) => {
        const result = reformData(data.contents);
        this.basketGoods = result;
      });
    },
  });

  Vue.component("basket-item", {
    props: ["item"],
    template: `
    <div class="basketItem">
            <img
              src="https://images.unsplash.com/photo-1526570207772-784d36084510?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80"/>
            <div>{{item.title }}</div>
            <div>{{item.price}}</div>
            <div><i class="fas fa-trash-alt"></i></div>
          </div>
    `,
  });

  Vue.component("search", {
    props: ["filter"],
    template: `
    <div class="header__search">
    <input class="header__search_input" type="text" v-model="$parent.search" />
    <button @click="$emit('click')" id="search">искать</button>
  </div>
    `,
  });

  const app = new Vue({
    el: "#app",
    data: {
      goods: [],
      filteredGoods: [],
      search: "",
      basketVision: false,
    },
    mounted() {
      service(URl, GOODS_POSTFIX).then((data) => {
        const result = reformData(data);
        this.goods = result;
        this.filteredGoods = result;
      });
    },
    methods: {
      filter() {
        this.filteredGoods = this.goods.filter(({ title }) => {
          return new RegExp(this.search, "i").test(title);
        });
      },
      showBasket() {
        this.basketVision = true;
      },
      closeBasket() {
        this.basketVision = false;
      },
    },
  });
};

// const basket = new Basket();
// basket.setGoods().then(() => {});
