import { fireEvent, render as rtlRender, screen } from "@testing-library/react";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import qualifiedReducer from "../reducers/qualifiedReducer";
import userDetailsReducer from "../reducers/userDetailsReducer";
import { BrowserRouter } from "react-router-dom";
import Landing from "../Components/Landing";
import userEvent from '@testing-library/user-event'


function createTestStore(initialState) {
    const store = createStore(combineReducers({ userDetails: userDetailsReducer, qualified: qualifiedReducer }), initialState);
    return store;
}

function renderWithRedux(component, { initialState, store = createTestStore(initialState) } = {}) {
    return {
        ...rtlRender(<Provider store={store}><BrowserRouter>{component}</BrowserRouter></Provider>)
    }
}


describe("with valid inputs", () => {
    const mockOnSubmit = jest.fn()

    it("correctly fills 'auto purchase price' field", () => {
        renderWithRedux(<Landing />)

        expect(screen.queryByDisplayValue(500)).not.toBeInTheDocument()
        fireEvent.change(screen.getByLabelText(/auto purchase price/i), { target: { value: 500 } })
        expect(screen.getByDisplayValue(500)).toBeInTheDocument();
    })

    it("correctly fills 'auto make' field", () => {
        renderWithRedux(<Landing />)

        expect(screen.queryByDisplayValue("Tesla")).not.toBeInTheDocument()
        fireEvent.change(screen.getByLabelText(/auto make/i), { target: { value: "Tesla" } })
        expect(screen.getByDisplayValue("Tesla")).toBeInTheDocument();
    })

    it("correctly fills 'auto model' field", () => {
        renderWithRedux(<Landing />)

        expect(screen.queryByDisplayValue("S")).not.toBeInTheDocument()
        fireEvent.change(screen.getByLabelText(/auto model/i), { target: { value: "S" } })
        expect(screen.getByDisplayValue("S")).toBeInTheDocument();
    })

    it("correctly fills 'income' field", () => {
        renderWithRedux(<Landing />)

        expect(screen.queryByDisplayValue(50000)).not.toBeInTheDocument()
        fireEvent.change(screen.getByLabelText(/income/i), { target: { value: 50000 } })
        expect(screen.getByDisplayValue(50000)).toBeInTheDocument();
    })

    it("correctly fills 'credit' field", () => {
        renderWithRedux(<Landing />)

        expect(screen.queryByDisplayValue(700)).not.toBeInTheDocument()
        fireEvent.change(screen.getByLabelText(/credit/i), { target: { value: 700 } })
        expect(screen.getByDisplayValue(700)).toBeInTheDocument();
    })

    it("correctly displays errors for invalid form fields", async () => {
        renderWithRedux(<Landing onSubmit={mockOnSubmit()} />)

        expect(screen.queryByText(/price is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/make is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/model is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/income is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/credit is required/i)).not.toBeInTheDocument()

        userEvent.click(screen.getByText(/submit/i))

        expect(mockOnSubmit).toHaveBeenCalledTimes(1)

        expect(await screen.findByText(/price is required/i)).toBeInTheDocument()
        expect(await screen.findByText(/make is required/i)).toBeInTheDocument()
        expect(await screen.findByText(/model is required/i)).toBeInTheDocument()
        expect(await screen.findByText(/income is required/i)).toBeInTheDocument()
        expect(await screen.findByText(/credit is required/i)).toBeInTheDocument()
    })

    it("allows the user to submit the form when all fields are correct", async () => {
        renderWithRedux(<Landing onSubmit={mockOnSubmit()} />)
        fireEvent.change(screen.getByLabelText(/auto purchase price/i), { target: { value: 500 } })
        fireEvent.change(screen.getByLabelText(/auto make/i), { target: { value: "Tesla" } })
        fireEvent.change(screen.getByLabelText(/auto model/i), { target: { value: "S" } })
        fireEvent.change(screen.getByLabelText(/income/i), { target: { value: 50000 } })
        fireEvent.change(screen.getByLabelText(/credit/i), { target: { value: 700 } })

        userEvent.click(screen.getByText(/submit/i))

        expect(mockOnSubmit).toHaveBeenCalled()
    })
})