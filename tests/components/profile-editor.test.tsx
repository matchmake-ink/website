import { render, screen, fireEvent, act } from "@testing-library/react";
import { setProfile } from "@/lib/client/profile";
import ProfileEditor from "@/components/profile-editor";
import { vi } from "vitest";

describe("ProfileEditor", () => {
  beforeEach(() => {
    vi.mock("@/lib/client/profile", () => ({
      setProfile: vi.fn(),
    }));
    vi.mock("@/lib/client/auth", () => ({
      useUser: () => ({
        user: {
          uid: "123",
        },
        userLoading: false,
        userError: false,
      }),
    }));
    render(<ProfileEditor />);
  });
  it("renders the form elments", () => {
    expect(screen.getByLabelText("IGN")).toBeInTheDocument();
    expect(screen.getByLabelText("Discord Tag")).toBeInTheDocument();
  });
  it("calls setProfile", () => {
    const ign = screen.getByLabelText("IGN");
    const discordTag = screen.getByLabelText("Discord Tag");
    act(() => {
      fireEvent.change(ign, {
        target: {
          value: "ign",
        },
      });
      fireEvent.change(discordTag, {
        target: {
          value: "discordTag",
        },
      });
      const submit = screen.getByText("Submit");
      fireEvent.click(submit);
    });

    expect(setProfile).toHaveBeenCalledWith("123", "ign", "discordTag");
  });
});
