import React from 'react'
import userEvent from '@testing-library/user-event'
import {render, screen, waitFor, fireEvent} from '@testing-library/react'
import App from './App';

jest.advanceTimersByTime(5005);

beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }))
    });
});

const checkAddForm = async () => {
    const addForm = await screen.getByTestId('todo-add-form');
    expect(addForm).toBeInTheDocument();
    return addForm;
}

const changeLanguage = async (addForm: HTMLElement) => {
    const appLanguageSelector = await screen.getByTestId('app-language-list');
    await userEvent.hover(appLanguageSelector);

    await waitFor(async () => {
        const appLanguageItemTr = await screen.getByTestId('app-language-list-item-tr');
        await userEvent.click(appLanguageItemTr);
    });

    await waitFor(() => {
        expect(addForm).toHaveTextContent(/Yeni Görev Oluştur/i);
    })
}

const addNewJob = async (addForm: HTMLElement, testJobTitle: string, testJobPriorityName: string) => {
    const jobTitle = await screen.getByTestId('todo-add-form-job-title');
    await userEvent.type(jobTitle, testJobTitle);

    const jobPriority = addForm.querySelector<HTMLElement>('[role="combobox"]');
    await userEvent.click(jobPriority!);

    const jobPriorityOption = await screen.findAllByText(testJobPriorityName);
    fireEvent.click(jobPriorityOption[0]);

    await new Promise((r) => setTimeout(r, 100));
    const formSubmitButton = await screen.getByTestId('todo-add-form-submit');
    await userEvent.click(formSubmitButton);
}

test('application run control', async () => {
    render(<App/>);

    await checkAddForm();
});

test('set language selection to turkish', async () => {
    render(<App/>);

    const addForm = await checkAddForm();
    await changeLanguage(addForm);

});

test('adding a new job to the job list', async () => {
    render(<App/>);

    const testJobTitle = 'test-job-1';
    const testJobPriorityName = 'Acil';

    const addForm = await checkAddForm();
    await changeLanguage(addForm);

    await addNewJob(addForm, testJobTitle, testJobPriorityName);

    await waitFor(async () => {
        const todoItemJobTitle = await screen.getByTestId(`todo-list-item-${testJobTitle}`);
        const todoItemJobPriority = await screen.getByTestId(`todo-list-item-${testJobPriorityName}`);

        expect(todoItemJobTitle).toBeInTheDocument();
        expect(todoItemJobPriority).toBeInTheDocument();
    });

});

test('update a job in the job list', async () => {
    render(<App/>);

    const testJobTitle = 'test-job-1';
    const testJobPriorityName = 'Acil';
    const testEditJobPriorityName = 'Normal';

    const addForm = await checkAddForm();
    await changeLanguage(addForm);

    await addNewJob(addForm, testJobTitle, testJobPriorityName);

    const jobEditButton = screen.getByTestId(`todo-list-item-edit-${testJobTitle}`);
    await userEvent.click(jobEditButton);

    const jobEditModal = await waitFor(() => {
        const jobEditModal = screen.getByTestId(`todo-edit-modal-${testJobTitle}`);
        expect(jobEditModal).toBeInTheDocument();
        return jobEditModal;
    });

    const jobPriority = jobEditModal.querySelector<HTMLElement>('[role="combobox"]');
    await userEvent.click(jobPriority!);

    const jobPriorityOption = await screen.findAllByText(testEditJobPriorityName);
    fireEvent.click(jobPriorityOption[jobPriorityOption.length - 1]);

    await new Promise((r) => setTimeout(r, 100));
    const formSubmitButton = await screen.getByTestId('todo-edit-form-submit');
    await userEvent.click(formSubmitButton);

    await waitFor(async () => {
        const todoItemJobTitle = await screen.getByTestId(`todo-list-item-${testJobTitle}`);
        const todoItemJobPriority = await screen.getByTestId(`todo-list-item-${testEditJobPriorityName}`);

        expect(todoItemJobTitle).toBeInTheDocument();
        expect(todoItemJobPriority).toBeInTheDocument();
    });
});

test('remove a job in the job list', async () => {
    render(<App/>);

    const testJobTitle = 'test-job-1';
    const testJobPriorityName = 'Acil';

    const addForm = await checkAddForm();
    await changeLanguage(addForm);

    await addNewJob(addForm, testJobTitle, testJobPriorityName);

    const jobRemoveButton = screen.getByTestId(`todo-list-item-remove-${testJobTitle}`);
    await userEvent.click(jobRemoveButton);

    const jobRemoveConfirm = await waitFor(() => {
        const jobRemoveConfirm = screen.getByRole('dialog');
        expect(jobRemoveConfirm).toBeInTheDocument();
        return jobRemoveConfirm;
    });

    const jobRemoveAporrove = jobRemoveConfirm.querySelector<HTMLElement>('[class="ant-btn ant-btn-primary"]');
    await userEvent.click(jobRemoveAporrove!);

    await new Promise((r) => setTimeout(r, 100));
    const todoList = screen.getByTestId('todo-list');
    expect(todoList).toHaveTextContent('Veri Yok');
});
