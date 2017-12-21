-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema valburguer
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `valburguer` ;

-- -----------------------------------------------------
-- Schema valburguer
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `valburguer` ;
USE `valburguer` ;

-- -----------------------------------------------------
-- Table `valburguer`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `valburguer`.`user` (
  `id` CHAR(36) NOT NULL,
  `login` VARCHAR(20) NOT NULL,
  `password` CHAR(64) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(11) NOT NULL,
  `email` VARCHAR(45) NULL,
  `address` VARCHAR(200) NULL,
  `date_created` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
COMMENT = 'Usuários do sistema Valburguer.';


-- -----------------------------------------------------
-- Table `valburguer`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `valburguer`.`category` (
  `id` CHAR(1) NOT NULL,
  `name` VARCHAR(15) NOT NULL,
  `list_order` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
COMMENT = 'Categoria de produtos: Lanches, Doces, Bebidas, Acompanhamentos ou Outos.';


-- -----------------------------------------------------
-- Table `valburguer`.`product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `valburguer`.`product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(200) NULL,
  `price` DECIMAL(5,2) NOT NULL,
  `category_id` CHAR(1) NOT NULL,
  `pic` MEDIUMTEXT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_product_category1_idx` (`category_id` ASC),
  CONSTRAINT `fk_product_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `valburguer`.`category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Armazena os produtos que podem ser pedidos. Obs.: as imagens dos produtos, se existir, são armazenadas em base64.';


-- -----------------------------------------------------
-- Table `valburguer`.`user_order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `valburguer`.`user_order` (
  `id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `order_number` INT NOT NULL AUTO_INCREMENT,
  `total_price` DECIMAL(6,2) NOT NULL,
  `date_created` DATETIME NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Recebido',
  `address` VARCHAR(200) NULL,
  `payment` CHAR(2) NULL,
  `date_updated` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `order_number_UNIQUE` (`order_number` ASC),
  INDEX `fk_user_order_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_user_order_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `valburguer`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Armazena os pedidos dos usuários.';


-- -----------------------------------------------------
-- Table `valburguer`.`order_product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `valburguer`.`order_product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order_id` CHAR(36) NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`id`, `product_id`, `order_id`),
  INDEX `fk_order_product_user_order1_idx` (`order_id` ASC),
  INDEX `fk_order_product_product1_idx` (`product_id` ASC),
  CONSTRAINT `fk_order_product_user_order1`
    FOREIGN KEY (`order_id`)
    REFERENCES `valburguer`.`user_order` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_order_product_product1`
    FOREIGN KEY (`product_id`)
    REFERENCES `valburguer`.`product` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Armazena os produtos associados a um determinado pedido e suas quantidades.';


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `valburguer`.`category`
-- -----------------------------------------------------
START TRANSACTION;
USE `valburguer`;
INSERT INTO `valburguer`.`category` (`id`, `name`, `list_order`) VALUES ('L', 'Lanches', 1);
INSERT INTO `valburguer`.`category` (`id`, `name`, `list_order`) VALUES ('A', 'Acompanhamentos', 2);
INSERT INTO `valburguer`.`category` (`id`, `name`, `list_order`) VALUES ('B', 'Bebidas', 3);
INSERT INTO `valburguer`.`category` (`id`, `name`, `list_order`) VALUES ('D', 'Doces', 4);
INSERT INTO `valburguer`.`category` (`id`, `name`, `list_order`) VALUES ('O', 'Outros', 5);

COMMIT;


-- -----------------------------------------------------
-- Data for table `valburguer`.`product`
-- -----------------------------------------------------
START TRANSACTION;
USE `valburguer`;
INSERT INTO `valburguer`.`product` (`id`, `name`, `description`, `price`, `category_id`, `pic`) VALUES (DEFAULT, 'Coca-cola (600 ml)', NULL, 8.00, 'B', NULL);
INSERT INTO `valburguer`.`product` (`id`, `name`, `description`, `price`, `category_id`, `pic`) VALUES (DEFAULT, 'Guaraná (lata)', NULL, 5.00, 'B', NULL);
INSERT INTO `valburguer`.`product` (`id`, `name`, `description`, `price`, `category_id`, `pic`) VALUES (DEFAULT, 'Guaraná (600 ml)', NULL, 8.00, 'B', NULL);
INSERT INTO `valburguer`.`product` (`id`, `name`, `description`, `price`, `category_id`, `pic`) VALUES (DEFAULT, 'Chilli Bacon Burger', 'Delicioso hambúrguer acompanhado de chilli e muito bancon.', 22.40, 'L', NULL);
INSERT INTO `valburguer`.`product` (`id`, `name`, `description`, `price`, `category_id`, `pic`) VALUES (DEFAULT, 'Chicken Breast Supreme', 'Hambúrguer feito com peito de frango marinado em suco de laranja, deixando-o incrivelmente macio, suculento e saboroso.', 20.25, 'L', NULL);
INSERT INTO `valburguer`.`product` (`id`, `name`, `description`, `price`, `category_id`, `pic`) VALUES (DEFAULT, 'Uni, Duni, Tê', 'Hambúrguer de carne bovina não com um, nem dois, mas TRÊS carnes pra você matar sua fome!', 25.90, 'L', NULL);
INSERT INTO `valburguer`.`product` (`id`, `name`, `description`, `price`, `category_id`, `pic`) VALUES (DEFAULT, 'Batata da casa', 'Batatas fritas salpicadas com queijo parmesão fresco.', 12.30, 'A', NULL);
INSERT INTO `valburguer`.`product` (`id`, `name`, `description`, `price`, `category_id`, `pic`) VALUES (DEFAULT, 'Batata do tio Tomás', 'Batatas rústicas temperadas com alecrim e um conjunto de especiarias que só o tio Tomás conhece!', 15.20, 'A', NULL);
INSERT INTO `valburguer`.`product` (`id`, `name`, `description`, `price`, `category_id`, `pic`) VALUES (DEFAULT, 'Pudim de leite', NULL, 8.40, 'D', NULL);
INSERT INTO `valburguer`.`product` (`id`, `name`, `description`, `price`, `category_id`, `pic`) VALUES (DEFAULT, 'Mousse de chocolate', NULL, 10.60, 'D', NULL);
INSERT INTO `valburguer`.`product` (`id`, `name`, `description`, `price`, `category_id`, `pic`) VALUES (DEFAULT, 'Coca-cola (lata)', NULL, 5.00, 'B', NULL);

COMMIT;

