import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { BetContainer, GameTypeButton } from './NewBetStyles';
import CartArea from '../../components/CartArea/CartArea';
import { Game, GameButtons, BetButton, AddButton } from '../../components/GameArea/GameAreaStyles';
import SelectedNumbers from '../../components/SelectedNumber/SelectedNumber';
import Data from '../../games.json';
import { Games } from '../../store/cartSlice';
import { IoCartOutline } from 'react-icons/io5';
import { VscError } from 'react-icons/vsc';
import { currentLoggedUser } from '../../store/regSlice';
import { useAppSelector } from '../../hooks/reduxhooks';
import { useHistory } from 'react-router-dom';
import Modal from '../../components/Modal/Modal';

let currentGameRange: number[] = [];
let total = Number(0);
let errorText: string;

interface CartItem {
    id: string;
    numbers: string;
    price: number;
    color: string;
    type: string;
}

const NewBet: React.FC = () => {

    const history = useHistory();
    const selectedCurrentUser = useAppSelector(currentLoggedUser)

    useEffect(() => {
        userCheck();
    });

    const userCheck = (): void => {
        if (!selectedCurrentUser) {
            history.push('/login')
        };
    };

    const [game, setGame] = useState<Games>({
        type: '', 
        description: '',
        range: 0,
        price: 0,
        'max-number': 0,
        color: '',
        'min-cart-value': 0
    });

    const [choseNumbers, setChoseNumbers] = useState<number[] | undefined>();
    const [toCart, setToCart] = useState<CartItem[] | []>([]);
    const [error, setError] = useState<boolean>(false);

    const errorHandler = (type: any) => {
        if (type === 'moreNumbers') {
            errorText = `To purchase a ${game.type} game, you have to bet ${game['max-number']} numbers. 
            Please, select ${game['max-number'] - choseNumbers!.length} more 
            ${game['max-number'] - choseNumbers!.length === 1 ? 'number' : 'numbers'}.`
        };

        if (type === 'randomGame') {
            errorText = `The game is already completed. If you want to change the numbers, please clear 
            the current game or de-select some number.`;
        };
        return setError(!error);
    };

    const cartAddHandler = (arg: CartItem[]) => {
        setToCart(arg);
    };

    const updateGameType = (e: string) => {
        if (e === game.type) {
            return;
        };

        if (e === 'Lotofácil') {
            currentGameRange = [];
            setGame(Data.types[0])
            pushNumbers(Data.types[0].range);
            setChoseNumbers([])
        };

        if (e === 'Mega-Sena') {
            currentGameRange = [];
            setGame(Data.types[1])
            pushNumbers(Data.types[1].range);
            setChoseNumbers([])
        };

        if (e === 'Quina') {
            currentGameRange = [];
            setGame(Data.types[2])
            pushNumbers(Data.types[2].range);
            setChoseNumbers([])
        };
    };

    const pushNumbers = (range: number) => {
        for (let i = 1; i <= range; i++) {
            currentGameRange.push(i)
        };
    };

    const selectNumber = (event: any): void => {
        const numberSelected = Number(event.currentTarget.dataset.number);

        if (numberAlreadyExists(choseNumbers!, numberSelected)) {
            const array = removeNumber(choseNumbers!, numberSelected);
            return setChoseNumbers(array);
        }
    
        if (choseNumbers!.length >= game['max-number']) {
            errorHandler('randomGame');
            return;
        };
    
        setChoseNumbers([...choseNumbers!, numberSelected])
    }
    
    const checker = (): boolean => {
        if (game.type === '') {
            return false;
        } else {
            return true;
        }
    }

    const numberAlreadyExists = (array: number[], number: number) => {
        return array.some((index) => {
            return index === number;
        });
    };

    const removeNumber = (array: number[], number: number) => {
        return (array = array.filter((num) => {
            return num !== number;
        }));
    };

    const getRandomGame = () => {
        let amount = game['max-number'] - choseNumbers!.length;
        if (amount === 0) {
            return errorHandler('randomGame');
        }
        const randomizedNumbers = generateNumbers(amount, game.range, choseNumbers!);
        setChoseNumbers([...randomizedNumbers]);
    };

    const generateNumbers = (amount: number, range: number, array: number[]) => {
        const getRandomNumbers = (max: number) => {
            return Math.ceil(Math.random() * max);
        };
        
        for (let i = 1; i <= amount; i++) {
            const number = getRandomNumbers(range)
            if (numberAlreadyExists(array, number)) {
              i--
            } else {
              array.push(number)
            }
          }
          return array
    };

    const formatNumbers = () => {
        let display = '';
        choseNumbers!.sort((a: number, b: number) => a - b).forEach((item: number, index: number) => {
            if (index !== choseNumbers!.length - 1) {
                display += `${item < 10 ? `0${item}` : item}, `
            } else {
                display += item
            }
        })
        return display;
    }

    const clearGame = (): void => {
        setChoseNumbers([]);
    };

    const addItemToCart = (): void => {
        if (choseNumbers!.length < game['max-number']) {
            errorHandler('moreNumbers');
            return;
        }

        total += game.price;

        cartAddHandler([...toCart, { id: Date.now().toString(), numbers: formatNumbers(), price: game.price, color: game.color, type: game.type }]);
    };

    const removeGame = (id: string, price: number) => {
        let newCart = toCart.filter((cartItem: CartItem) => id !== cartItem.id);
        total -= price;
        return setToCart(newCart);
    };

    const handleCleanUp = (): void => {
        setToCart([]);
        total = Number(0);
        setChoseNumbers([]);
    }

    return (
        <>
            <Navbar />
            <BetContainer>
            <Game>
                <p id="newbet"><strong>NEW BET</strong> {checker() && `FOR ${game.type.toUpperCase()}`}</p>
                <p><strong>Choose a game</strong></p>
                <GameButtons>
                    {Data.types.map((button) => {
                        let color = button.color
                        let bgc = '#fff';
                        let border = color;
                        if (game.type === button.type) {
                            bgc = color;
                            color = '#fff';
                            border = '#fff';
                        }

                        return (
                            <GameTypeButton
                            color={color}
                            bgc={bgc}
                            border={`.15rem solid ${border}`}
                            key={button.type}
                            className={button.type}
                            onClick={e => updateGameType(e.currentTarget.value)}
                            value={button.type}>{button.type}</GameTypeButton>
                        )
                    })}
                </GameButtons>
                {checker() && <div className="descriptionArea">
                    <p><strong>Fill your bet</strong></p>
                    <p>{game.description}</p>
                </div>}
                {checker() && <div className="numbersArea">
                    {currentGameRange.map(button => {
                        let selected = false;
                        if (choseNumbers!.includes(button)) selected = true
                        let bgc = selected ? game.color : '#ADC0C4';
                        return (
                            <SelectedNumbers bgc={bgc} clicked={selectNumber} number={button} key={button} />
                        )
                    })}
                </div>}
                {checker() && <div className="buttonsArea">
                    <div>
                        <BetButton onClick={getRandomGame} width="10rem" id="complete">Complete game</BetButton>
                        <BetButton onClick={clearGame} width="8.5rem" id="clear">Clear game</BetButton>
                    </div>
                    <AddButton onClick={addItemToCart} id="add"><IoCartOutline size="1.5rem" className="cartIcon" />Add to cart</AddButton>
                </div>}
            </Game>
                <CartArea cart={toCart} onRemoveGame={removeGame} total={total} handleCleanUp={handleCleanUp} />
            </BetContainer>
            {error && <Modal onClose={errorHandler}>
            <div className="errorHeader">
                <h2><VscError /></h2>
            </div>
            <div className="errorText">
                <p>{errorText}</p>
                <button onClick={errorHandler}>Try again</button>
            </div>
        </Modal>}
        </>
    );
};

export default NewBet;